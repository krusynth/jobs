'use strict';

const express = require('express');
const Sequelize = require('sequelize');
const models = require('../models');
const extend = require('util')._extend;

// TODO: finish normalizing interfaces (req/res -> this.req/this.res)

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

  req = null;
  res = null;

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
      console.log('error', error);
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
    this.req = req;
    this.res = res;

    return this.beforeUpdate(this.req.body)
    .then(args => this.doUpdate(args))
    .then(args => this.afterUpdate(args))
    .catch(args => this.catchErrors(args));
  }

  beforeUpdate(data) {
    data = data || {};
    delete data.createdAt;
    delete data.updatedAt;

    return Promise.resolve(data);
  }

  doUpdate(data) {
    let query = {where: {'id' : data.id}};
    query = this.authQuery(query, this.req, this.res);

    return this.model.findOne(query)
    .then(instance => {
      instance.set(data);
      return instance.save();
    })
  }

  afterUpdate(data) {
    return this.readById(this.req, this.res);
  }

  updateMany(req, res, next) {
    this.req = req;
    this.res = res;

    // Expects the req.body.id to be a list of ids.
    // We unset that so it won't be in the update data.
    let updateData = extend({}, req.body);
    delete updateData.id;

    this.model.update(
      updateData,
      {where: {'id' : {$in: req.body.id}}}
    )
    .then(args => this.afterUpdateMany(args))
    .catch(args => this.catchErrors(args));
  }

  afterUpdateMany(data) {
    this.req.send({'message': 'ok'})
  }

  delete(req, res, next) {
    this.req = req;
    this.res = res;

    this.beforeDelete(req.body)
    .then(args => this.doDelete(args))
    .then(args => this.afterDelete(args))
    .catch(args => this.catchErrors(args));
  }

  beforeDelete(data) {
    return Promise.resolve(data);
  }

  doDelete(data) {
    let query = {where: {id : this.req.params.id}};
    query = this.authQuery(query, this.req, this.res);

    return this.model.destroy(query)
  }

  afterDelete(data) {
    this.res.send({'message': 'ok'})
  }

  catchErrors(error) {
    console.log('error', error);
    this.res.status(400).send(this.parseErrors(error));
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
