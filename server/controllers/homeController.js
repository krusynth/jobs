'use strict';

const express = require('express');

class HomeController {
  route = '*';
  default = true;

  constructor(app) {
    this.app = app;
  }

  handle() {
    this.app.express.get(this.route, this.render.bind(this));
  }

  render(req, res, next) {
    res.render('home', {page:'Home'});
  }
}

module.exports = HomeController;
