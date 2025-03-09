'use strict';

const Controller = require('../lib/controller');
const { UserLevel } = require('../models');

class UserLevelApiController extends Controller {
	api = true;
	model = UserLevel;
	route = '/api/userlevel';
}

module.exports = UserLevelApiController;