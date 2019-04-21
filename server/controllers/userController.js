'use strict';

const Controller = require('../lib/controller');
const { User, Action } = require('../models');
const express = require('express');
const moment = require('moment');

class UserController extends Controller {
  model = User;
  route = '/api/user';

  auth = false;

  authField = 'id';

  constructor(options) {
    super(options);
  }

  setRoutes() {
    const router = express.Router();
    router.post('/', this.create.bind(this)); // No auth to create an account.

    // Auth required to do everything else.
    router.get('/', this.app.authMiddleware, this.read.bind(this));
    router.put('/', this.app.authMiddleware, this.updateMany.bind(this));

    router.get('/current', this.app.authMiddleware, this.readCurrent.bind(this));
    router.put('/current', this.app.authMiddleware, this.updateCurrent.bind(this));

    router.get('/:id', this.app.authMiddleware, this.readById.bind(this));
    router.put('/:id', this.app.authMiddleware, this.update.bind(this));

    // Don't allow deleting for now.
    // TODO: make this work.
    // router.delete('/:id', this.app.authMiddleware, this.delete.bind(this));

    return router;
  }

  beforeCreate(req, res) {
    this.authField = null;
    let data = req.body;
    // Hardcode our user level value.
    // TODO: look this up somewhere.
    data.userLevelId = 1;

    return Promise.resolve([req, res, data]);
  }

  afterCreate(args) {
    let [data, req, res] = args;
    this.readById(req, res);
    return Promise.resolve([req, res]);
  }

  readCurrent(req, res, next) {
    let query = {'where': {}};

    try {
      query.where.id = req.session.passport.user.id;
    }
    catch(error) {
      res.status(401).send();
      return;
    }

    this.model.findOne(query)
    .then( result => this._handleMeta(result) )
    .then( this._readById )
    .then( result => res.send(result))
    .catch(this.catchErrors);
  }

  _readById(result) {
    // Convert Sequelize instance to plain object.
    let data = result.get();

    // Remove our private fields.
    delete data['password'];
    delete data['salt'];
    delete data['token'];

    return data;
  }

  _handleMeta(data) {
    return this._handleActions(data)
    .then( result => this._handleMood(result) )
    .then((data) => {
      data.save();
    })
    .then( () => data );
  }

  _handleActions(data) {
    return new Promise((resolve, reject) => {

      // If we don't have recent actions...
      if(
        typeof data.meta == 'undefined' ||
        data.meta == null ||
        typeof data.meta.actionDate == 'undefined' ||
        moment(data.meta.actionDate).toDate() < moment().subtract(6,'d').toDate()
      ) {

        // Get four actions.
        let query = this.buildWhere({
          order: 'random',
          limit: 4
        });

        return Action.findAll(query)
        .then( result => {
          let meta = data.meta || {};
          meta.actionDate = new Date();
          meta.actions = result;

          data.set({
            meta: meta
          });

          resolve(data);
          // return data;
        })
      }
      else {
        resolve(data);
      }
    });
  }

  _handleMood(data) {
    return data;
  }

  updateCurrent(req, res, next) {
    try {
      req.params.id = req.session.passport.user.id;
    }
    catch(error) {
      res.status(401).send();
      return;
    }

    return this.update(req, res, next);
  }

  beforeUpdate(data) {
    return Controller.prototype.beforeUpdate(data)
    .then( data => {
      delete data.userLevelId;
      return data;
    })
  }
}

module.exports = UserController;
