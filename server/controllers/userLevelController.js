'use strict';

const Controller = require('../lib/controller');
const { UserLevel } = require('../models');

class UserLevelController extends Controller {
	model = UserLevel;
	route = '/api/userlevel';
}

module.exports = UserLevelController;