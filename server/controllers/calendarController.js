'use strict';

const express = require('express');
const ical = require('ical-generator');
const Controller = require('../lib/controller');
const { User, JobEvent, Job } = require('../models');

class CalendarController extends Controller {

  route = '/api/calendar';

  model = User;

  // Standard CRUD routes
  setRoutes() {
    const router = express.Router();
    router.get('/', this.read.bind(this));
    router.get('/:id', this.readById.bind(this));

    return router;
  }

  read(req, res, next) {
    let query = {'where': {}};

    try {
      query.where.id = req.session.passport.user.id;
    }
    catch(error) {
      res.status(401).send();
      return;
    }

    this.model.findOne(query).then( user => {
      console.log('user', user.meta);
      res.redirect(`/api/calendar/${user.meta.calendarId}`);
    })
  }

  readById(req, res, next) {
    let query = {
      where: {
        type: 'Interview'
      },
      include: [
        {
          model: Job,
          required: true,

          include: {
            model: User,
            required: true,
            // where: {id: req.session.passport.user.id},
            where: {'meta.calendarId': req.params.id}
          }
        }
      ]
    };
    JobEvent.findAll(query)
    .then(result => {
      let hostname = this.app.config.host.name;
      if(this.app.config.host.port != 80 || this.app.config.host.port != 443) {
        hostname += ':' + this.app.config.host.port;
      }

      let config = {
        name: 'Job.Hunt.Works',
        domain: 'job.hunt.works',
        url: `http://${hostname}/${this.route}/${req.params.id}`,
        method: 'publish'
      };
      let cal = ical(config);

      result.forEach((event) => {
        console.log(event.Job.User);
        cal.createEvent({
          start: event.date,
          allDay: true,
          summary: `${event.Job.company} - ${event.Job.name} Interview`
        });
      });

      cal.serve(res);
    })
    .catch( (error) => {
      console.log('error', error);
      res.status(400).send(this.parseErrors(error));
    });
  }

}

module.exports = CalendarController;
