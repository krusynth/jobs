'use strict';

const Controller = require('../lib/controller');
const { User } = require('../models');
const sequelize = require('sequelize');
const express = require('express');

class UpdateAccountController extends Controller {
  model = User;
  // relModels = [{model: JobEvent}];

  route = '/account';
  authField = 'id';
  auth = true;

  // By default all gets & puts go to this same account.
  setRoutes() {
    const router = express.Router();
    router.get('/', this.showForm.bind(this));

    return router;
  }

  showForm(req, res, next) {
    res.render('account/home');
  }
}
module.exports = UpdateAccountController;
