'use strict';

const express = require('express');
const Controller = require('../lib/controller');

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

      let pageData = {
        page: 'Home',
        currentStatus: null,
        statusOptions: {
          'happy': 1,
          'neutral': 0,
          'down': -1
        },
        statusMessage: ''
      }
      res.render('home/user-home', pageData);

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
