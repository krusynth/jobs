'use strict';

const Controller = require('../lib/controller');
const { User } = require('../models');
const sequelize = require('sequelize');
const express = require('express');

class SignupController extends Controller {
  model = User;
  // relModels = [{model: JobEvent}];

  route = '/signup/';
  auth = false;

  // By default all gets & puts go to this same account.
  setRoutes() {
    const router = express.Router();
    router.get('/', this.showForm.bind(this));

    return router;
  }

  showForm(req, res, next) {
    res.render('signup/home');
  }
}
module.exports = SignupController;
