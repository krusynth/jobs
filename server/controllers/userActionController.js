'use strict';

const Controller = require('../lib/controller');
const { UserAction } = require('../models');

class UserActionController extends Controller {
  model = UserAction;
  route = '/api/user/action';
}

module.exports = UserActionController;
