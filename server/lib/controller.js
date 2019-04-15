'use strict';

const express = require('express');
const Sequelize = require('sequelize');
const models = require('../models');
const extend = require('util')._extend;

class Controller {
  // Access to our models.
  models = models;

  // The model to use.
  model = null;

  // Route to this controller.
  route = '';

  // Set to true for our default "catch all" route.
  default = false;

  // Require authorization to view this page?
  auth = false;

  // Additional middleware.
  middleware = [];

  // Objects to include in our queries
  relModels = [];

  // Default sort order
  order = [['createdAt', 'DESC']];

  // If this data is restricted to a given user, which field to use?
  authField = null; // 'userId';

  // Temporary reference to our current instance.
  _instance = null;

  constructor(app) {
    this.app = app;

    // Set our routes.
    this.router = this.setRoutes();

    // Initialize the app.
    this.init();
  }

  // Standard CRUD routes
  setRoutes() {
    const router = express.Router();
    router.get('/', this.read.bind(this));
    router.post('/', this.create.bind(this));
    router.put('/', this.updateMany.bind(this));
    router.get('/:id', this.readById.bind(this));
    router.put('/:id', this.update.bind(this));
    router.delete('/:id', this.delete.bind(this));

    return router;
  }

  init() {}

  handle() {
    if(this.auth) {
      this.middleware.unshift(this.app.authMiddleware);
    }

    let handlers = [].concat(
      this.app.preMiddleware,
      this.middleware,
      [this.router],
      this.app.postMiddleware
    );

    this.app.express.use(this.route, handlers);
  }

  read(req, res, next) {
    let query = this.buildWhere(req.query);
    query = this.authQuery(query, req, res);

    this.model.findAndCountAll(query)
    .then(result => this._read(result))
    .then(result => {
      res.setHeader('totalrecords', result.count);
      res.send(result.rows);
    })
    .catch( (error) => {
      console.log('error', error);
      res.status(400).send(this.parseErrors(error));
    });
  }

  readById(req, res, next) {
    let query = {
      where: {id : req.params.id}
    };
    if(this.relModels.length > 0) {
      query.include = this.relModels;
    }
    if(this.order) {
      query.order = this.order;
    }
    query = this.authQuery(query, req, res);

    this.model.findOne(query)
    .then( data => this._instance = data)
    .then(this._readById)
    .then( data => {
      res.send(data);
    })
    .catch( (error) => {
      console.log('error', error);
      res.status(400).send(this.parseErrors(error));
    });
  }

  create(req, res, next) {
    this.beforeCreate(req,res)
    .then((args) => this.doCreate(args))
    .then((args) => this.afterCreate(args))
    .catch( (error) => {
      console.log('create error', error);
      res.status(400).send(this.parseErrors(error));
    });
  }

  beforeCreate(req, res) {
    return Promise.resolve([req, res, req.body]);
  }

  doCreate(args) {
    let [req, res, data] = args;
    return this.model.create(data)
    .then( newData => {
      req.params.id = newData.id;
      return [newData, req, res];
    });
  }

  afterCreate(args) {
    let [data, req, res] = args;
    this.readById(req, res);
    return Promise.resolve([req, res]);
  }

  update(req, res, next) {
    let query = {where: {'id' : req.params.id}};
    query = this.authQuery(query, req, res);

    this.model.findOne(query).then( (instance) => {
      this._instance = instance;

      let updateData = extend({}, req.body);
      delete updateData.updatedAt;
      delete updateData.createdAt;
      this._instance.set(updateData);
      let changedData = this._instance.changed();

      this._instance.save().then( (data) => {
        data.changed = changedData;

        this.afterUpdate(data, req, res).then((result) => {
          this.readById(result[0], result[1]);
        });
      }).catch( (error) => {
        console.log('error', error);
        res.status(400).send(this.parseErrors(error));
      });
    }).catch( (error) => {
      console.log('error', error);
      res.status(400).send(this.parseErrors(error));
    });
  }

  afterUpdate(data, req, res) {
    return (Promise.resolve([req, res]));
  }

  updateMany(req, res, next) {
    // Expects the req.body.id to be a list of ids.
    // We unset that so it won't be in the update data.
    let updateData = extend({}, req.body);
    delete updateData.id;

    this.model.update(
      updateData,
      {where: {'id' : {$in: req.body.id}}}
    ).then( (data) => {
      this.afterUpdateMany(data, req, res).then((result) => {
        result[1].send();
      });
    });
  }

  afterUpdateMany(data, req, res) {
    return (Promise.resolve([req, res]));
  }

  delete(req, res, next) {
    let query = {where: {id : req.params.id}};
    query = this.authQuery(query, req, res);

    this.model.destroy(query).then( (data) => {
      this.afterDelete(data, req, res).then((result) => {
        result[1].send({'message': 'ok'});
      });
    }).catch( (error) => {
      console.log('error', error);
      res.status(400).send(this.parseErrors(error));
    });
  }

  afterDelete(data, req, res) {
    return (Promise.resolve([req, res]));
  }

  parseErrors(error) {
    if(typeof error.errors === 'undefined' &&
      typeof error.message !== 'undefined') {
      return error.message;
    }

    let errors = {};

    for(let i in error.errors) {
      let errorObj = error.errors[i];

      errors[errorObj.path] = errorObj.message;
    }

    return errors;
  }

  buildWhere(reqQuery) {
    let query = reqQuery || {};

    if(reqQuery.offset) {
      query.offset = parseInt(reqQuery.offset);
    }

    if(reqQuery.limit) {
      query.limit = parseInt(reqQuery.limit);
    }

    query.order = this.order;
    if(reqQuery.order) {
      if(reqQuery.order == 'random') {
        switch(models.sequelize.getDialect()) {
          case 'mysql':
            query.order = Sequelize.literal('rand()');
            break;

          case 'postgres':
            query.order = Sequelize.literal('random()');
            break;
        }
      }
      else if(typeof reqQuery.order == 'string') {
        console.log('order', reqQuery.order);
        query.order = [reqQuery.order.split(' ')];
      }
      else {
        query.order = reqQuery.order;
      }
    }

    if(this.relModels.length > 0) {
      query.include = this.relModels;
    }

    return query;
  }

  authQuery(query, req, res) {
    if(this.authField) {
      return this.authByField(query, req, res);
    }
    return query;
  }

  authByField(query, req, res) {
    if(!req.session.passport.user.id) {
      res.status(401).send('Unauthorized access.');
    }
    else {
      if(!query.where) {
        query.where = {};
      }

      // If we have a "." in the field we have a relational table.
      if(this.authField.indexOf('.') >= 0) {
        let [modelName, fieldName] = this.authField.split('.');

        if(!query.include) {
          query.include = [];
        }

        query.include.push({
          model: this.models[modelName],
          where: {[fieldName]: req.session.passport.user.id},
          attributes: []
        });
      }
      else {
        query.where[this.authField] = req.session.passport.user.id;
      }
    }
    return query;
  }

  _read(result) { return Promise.resolve(result); }
  _readById(data) { return Promise.resolve(data); }

}

module.exports = Controller;
