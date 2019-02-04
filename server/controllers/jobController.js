'use strict';

const Controller = require('../lib/controller');
const { Job, JobEvent } = require('../models');
const sequelize = require('sequelize');

class JobController extends Controller {
	model = Job;
	relModels = [{model: JobEvent}];
	order = [
		sequelize.literal('(CASE WHEN "Job"."watching" THEN 1 ELSE 0 END) DESC'),
		['createdAt', 'DESC'],
		['JobEvents', 'date', 'DESC']
	];
	route = '/api/job';
  authField = 'userId';
  auth = true;

  beforeCreate(req, res) {
    let data = req.body;

    data[this.authField] = req.session.passport.user.id;

    return Promise.resolve([req, res, data]);
  }
}
module.exports = JobController;
