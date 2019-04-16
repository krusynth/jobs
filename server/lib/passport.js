'use strict';

const config = require('../config.js');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
  },
  function(email, password, done) {
    let query = {
      where: {}
    };

    if(config.db.dialect === 'postgres') {
      query.where.email = {[Op.iLike]: email};
    }
    else {
      query.where.email = email;
    }

    User.findOne(query).then(function(user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      } else {
        let rawUser = user.get({raw: true});
        if (rawUser.password != User.hashPassword(password, rawUser.salt)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
      }
      return done(null, user);
    });
  }
));

passport.authMiddleware = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  else {
    res.status(401).send({ message: 'Not authorized.' });
  }
}


module.exports = passport;
