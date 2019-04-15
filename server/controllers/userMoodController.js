'use strict';

const express = require('express');
const moment = require('moment');
const Controller = require('../lib/controller');
const Sequelize = require('sequelize');
const { UserMood, User, sequelize } = require('../models');

const Op = Sequelize.Op;

class UserActionController extends Controller {
  model = UserMood;
  userModel = User;
  route = '/api/user/mood';

  auth = true;

  authField = 'userId';

  howLongAgo = 140; // In days.

  setRoutes() {
    const router = express.Router();
    router.get('/', this.read.bind(this));
    router.post('/', this.create.bind(this));
    router.put('/', this.updateMany.bind(this));
    router.get('/recent', this.getRecent.bind(this));
    router.get('/:id', this.readById.bind(this));
    return router;
  }

  getRecent(req, res) {
    // Get averages for the last 14 days.
    let dateField = sequelize.fn('date_trunc', 'day', sequelize.col('createdAt'));
    let query = {
      'attributes': [ [sequelize.fn('avg', sequelize.col('mood')), 'avgmood'], [dateField, 'created'] ],
      'where': {
        'createdAt': { $gte: moment().subtract(this.howLongAgo, 'days').toDate() }
      },
      'group': [dateField],
      'order': [dateField]
    };

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

  beforeCreate(req, res) {
    let data = req.body;

    data[this.authField] = req.session.passport.user.id;

    return Promise.resolve([req, res, data]);
  }
}

module.exports = UserActionController;
