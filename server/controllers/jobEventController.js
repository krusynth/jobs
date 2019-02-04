'use strict';

const Controller = require('../lib/controller');
const { JobEvent, Job } = require('../models');

class JobEventController extends Controller {
	model = JobEvent;
  jobModel = Job;

	order = [['date', 'DESC']];
	route = '/api/job/event';
  auth = true;

  authField = 'Job.userId';

  beforeCreate(req, res) {
    let data = req.body;

    // TODO: check if this user owns this job.

    return Promise.resolve([req, res, data]);
  }
}

module.exports = JobEventController;
