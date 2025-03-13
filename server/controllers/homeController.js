'use strict';

const express = require('express');
const Controller = require('../lib/controller');

const { User, Bwmd } = require('../models');

class HomeController extends Controller {
  route = '/';
  default = true;

  setRoutes() {
    const router = express.Router();
    router.get('/', this.home.bind(this));
    router.get('/about/', this.about.bind(this));
    router.get('/tos/', this.tos.bind(this));
    router.get('/resources/', this.resources.bind(this));

    return router;
  }

  // handle() {
  //   this.app.express.get(this.route, this.render.bind(this));
  // }

  home(req, res, next) {
    if(res.locals.user) {
      const statusMessages = [
        'You\'re doing it!',
        'Keep going!',
        'You got this!',
        'I believe in you!'
      ];

      // Figure out how many days since our launch date
      // Use this to figure out the offset in the bwmd posts.

      let userPromise = User.findOne({where: {id: req.session.passport.user.id}});

      let days = Math.round((new Date() - new Date('2025-03-13')) / (1000 * 60 * 60 * 24));
      let bwmdPromise =  Bwmd.findOne({order: [['date', 'ASC']], offset: days});

      Promise.all([userPromise, bwmdPromise]).then(results => {
        const [user, bwmd] = results;

        let host = req.get('host');

        const calendarUrl = 'https://job.hunt.works/api/calendar/' + user.meta.calendarId

        let pageData = {
          page: 'Home',
          calendarUrl: calendarUrl,
          currentStatus: null,
          statusOptions: {
            'happy': 1,
            'neutral': 0,
            'down': -1
          },
          bwmd: bwmd.content,
          statusMessage: ''
        }
        res.render('home/user-home', pageData);

      });
    }
    else {
      res.render('home/home', {page:'Home'});
    }
  }

  about(req, res, next) {
      res.render('home/about', {page:'About'});
  }

  tos(req, res, next) {
      res.render('home/tos', {page:'Terms of Service'});
  }

  resources(req, res, next) {
      res.render('home/resources', {page:'Resources'});
  }
}

module.exports = HomeController;
