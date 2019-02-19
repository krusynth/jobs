'use strict';

const Controller = require('../lib/controller');
const { UserMood, User } = require('../models');

class UserActionController extends Controller {
  model = UserMood;
  userModel = User;
  route = '/api/user/mood';

  auth = true;

  authField = 'userId';

  beforeCreate(req, res) {
    let data = req.body;

    data[this.authField] = req.session.passport.user.id;

    return Promise.resolve([req, res, data]);
  }
}

module.exports = UserActionController;
