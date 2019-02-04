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
    router.get('/:id', this.app.authMiddleware, this.readById.bind(this));
    router.put('/:id', this.app.authMiddleware, this.update.bind(this));

    // Don't allow deleting for now.
    // TODO: make this work.
    // router.delete('/:id', this.app.authMiddleware, this.delete.bind(this));

    return router;
  }

  beforeCreate(req, res) {
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

  readById(req, res, next) {
    let id = req.params.id;
    if(req.params.id === 'current') {
      // Check session, set id to user id from session.
      try {
        id = req.session.passport.user.id;
      }
      catch(error) {
        res.status(401).send();
        return;
      }
    }
    this.model.findOne({'where': {'id' : id}})
    .then( data => this._instance = data)
    .then(this._readById)
    .then( data => {
      res.send(data);
    })
    .catch((error) => {
      res.status(400).send(this.parseErrors(error));
    });
  }

  _readById = (data) => {
    // If we don't have recent actions...
    if(
      typeof data.meta == 'undefined' ||
      data.meta == null ||
      typeof data.meta.actionDate == 'undefined' ||
      data.meta.actionDate < moment().subtract(6,'d').toDate()
    ) {

      // Get four actions.
      let query = this.buildWhere({
        order: 'random',
        limit: 4
      });

      return Action.findAll(query)
      .then( result => {
        let meta = result.meta || {};
        meta.actionDate = new Date();
        meta.actions = result;

        data.set({
          meta: meta
        });
        return data.save();
      })
      .then( result => {
        // Hoist our data and return it.
        return data;
      });
    }

    return data;
  }
}

module.exports = UserController;
