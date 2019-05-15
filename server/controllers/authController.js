'use strict';

const express = require('express');
// const mailer = require('express-mailer');
const renderEjs = require('../lib/renderEjs');
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
    console.log('body', req.body);
    if(req.body.email) {
      this.model.findOne({where: {email: req.body.email}})
      .then( (user) => {
        if(!user) {
          return Promise.reject("Couldn't find user.");
        }

        let token = this.model.generateToken();
        user.token = token;

        let replaceData = {
          firstName: user.firstName,
          lastName: user.lastName,
          link: req.protocol + '://' + req.headers.host + '/resetpassword/' + token
        }

        let promise = Promise.all([
          user.save(),
          renderEjs('server/views/mail/forgotpassword.html.ejs', replaceData),
          renderEjs('server/views/mail/forgotpassword.txt.ejs', replaceData)
        ]);
        return promise.then( ([data, htmlMessage, textMessage]) => {
          return this.app.mailer.send({
            to: req.body.email,
            from: 'noreply@job.hunt.works',
            subject: 'Job.Hunt.Works Password Reset',
            html: htmlMessage,
            text: textMessage
          });
        })
        .then( () => {
          res.status(200).send({});
        });
      }).catch( (error) => {
        console.log('Couldn\'t send email', error);
        res.status(400).send({'email': error});
      });
    }
    else {
      res.status(400).send({'email': 'Email address is missing.'});
    }
  }

  checkToken(req, res, next) {
    this.model.findOne({where: {token: req.params.token}}).then( (user) => {
      if(user) {
        res.status(200).send({});
      }
      else {
        console.log('Couldn\'t find user');
        res.status(404).send({error: 'Token not found.'});
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
          res.status(200).send({});
        }).catch( (error) => {
          console.log('Error saving user', error);
          res.status(400).send(this.parseErrors(error));
        });
      }
      else {
        console.log('Couldn\'t find user');
        res.status(400).send({error: 'Couldn\'t find token.'});
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
