'use strict';

const express = require('express');
// const mailer = require('express-mailer');
const renderEjs = require('../lib/renderEjs');
const Controller = require('../lib/controller');
const { User } = require('../models');

class AuthController extends Controller {
  model = User;

  // route = '/api/auth';
  route = '';

  // Additional middleware.
  middleware = [];

  setRoutes() {
    const router = express.Router();
    router.get('/login', this.login.bind(this));
    router.post('/login',
      this.app.passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login?fail=true',
        failureMessage: true
      })
    );
    router.get('/logout', this.logout.bind(this));
    router.get('/forgotPassword', this.forgotPassword.bind(this));
    router.post('/forgotpassword', this.sendToken.bind(this));
    router.get('/checktoken/:token', this.checkToken.bind(this));
    router.post('/resetpassword/:token', this.resetPassword.bind(this));
    return router;
  }

  login(req, res, next) {
    let errors = [];
    if(req.query.fail) {
      errors.push('The email address or password is not correct. Try again?');
    }

    res.render('auth/login', {
      page:'Login',
      errors: errors
    });
    //res.status(200).send('1');
  }

  logout(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  }

  forgotPassword(req, res, next) {
    res.render('forgotpassword/home');
  }

  sendToken(req, res, next) {
    console.log('here');
    if(req.body.email) {
      this.model.findOne({where: {email: req.body.email}})
      .then( (user) => {
        if(!user) {
          res.status(400).send({'email': 'Couldn\'t find that account.'});
        }
        else {
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
        }
      }).catch( (error) => {
        console.log('Couldn\'t send email', error);
        res.status(400).send({'email': 'Couldn\'t send email. Please try again later.'});
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
