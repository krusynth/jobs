'use strict';

const Controller = require('../lib/controller');
const { Action } = require('../models');

class ActionController extends Controller {
  model = Action;
  route = '/api/action';
  auth = true;
}

module.exports = ActionController;
