'use strict';

const express = require('express');
const mailer = require('express-mailer');
const Controller = require('../lib/controller');
const { User } = require('../models');

class AuthController {
  model = User;

  route = '/api/auth';

  // Additional middleware.
  middleware = [];

  constructor(app) {
    this.app = app;

    // Set our routes.
    this.router = this.setRoutes();
  }

  setRoutes() {
    const router = express.Router();
    router.post('/login', this.app.passport.authenticate('local'), this.login.bind(this));
    router.post('/logout', this.logout.bind(this));
    router.post('/forgotpassword', this.sendToken.bind(this));
    router.get('/checktoken/:token', this.checkToken.bind(this));
    router.post('/resetpassword/:token', this.resetPassword.bind(this));
    return router;
  }

  handle() {
    let middleware = this.middleware.push(this.router);

    let handlers = [].concat(
      this.app.preMiddleware,
      middleware,
      this.app.postMiddleware
    );

    this.app.express.use(this.route, this.router);
  }

  login(req, res, next) {
    res.status(200).send('1');
  }

  logout(req, res, next) {
    req.logout();
    res.status(200).send('1');
  }

  sendToken(req, res, next) {
    if(req.body.email) {
      this.model.findOne({where: {email: req.body.email}}).then( (user) => {
        var token = this.model.generateToken();
        var forgotLink = req.protocol + '://' + req.headers.host + '/resetpassword/' + token;
        user.token = token;
        user.save().then( (data) => {
          res.mailer.send('../views/email/forgotpassword.hbs', {
            to: user.email,
            subject: 'Deepbills Password Reset',
            link: forgotLink
          }, (error) => {
            if(error) {
              console.log('Couldn\'t send email', error);
              res.status(400).send(error);
            }
            else {
              res.status(200).send();
            }
          });
        }).catch( (error) => {
          console.log('Couldn\'t save user', error);
          res.status(400).send(error);
        });
      }).catch( (error) => {
        console.log('Couldn\'t get user', error);
        res.status(400).send(error);
      });
    }
    else {
      res.status(400).send();
    }
    // Todo
  }

  checkToken(req, res, next) {
    this.model.findOne({where: {token: req.params.token}}).then( (user) => {
      if(user) {
        res.status(200).send();
      }
      else {
        console.log('Couldn\'t find user');
        res.status(404).send();
      }
    }).catch( (error) => {
      console.log('Error finding user', error);
      res.status(400).send(error);
    });
  }

  resetPassword(req, res, next) {
    this.model.findOne({where: {token: req.params.token}}).then( (user) => {
      if(user) {
        user.password = req.body.password;
        user.token = '';
        user.save().then( (data) => {
          res.status(200).send();
        }).catch( (error) => {
          console.log('Error saving user', error);
          res.status(400).send(this.parseErrors(error));
        });
      }
      else {
        console.log('Couldn\'t find user');
        res.status(404).send();
      }
    }).catch( (error) => {
      console.log('Error finding user', error);
      res.status(400).send(error);
    });
  }


  parseErrors(error) {
    var errors = {};

    for(let i in error.errors) {
      let errorObj = error.errors[i];

      errors[errorObj.path] = errorObj.message;
    }

    return errors;
  }
}

module.exports = AuthController;
