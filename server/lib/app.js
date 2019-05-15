'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mailer = require('express-mailer');
// const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const passport = require('../lib/passport');

const config = require('../config.js');

const sgMail = require('@sendgrid/mail');

class App {

	constructor(config) {
    this.config = config;

		this.express = express();
		this.preMiddleware = [];
		this.postMiddleware = [];
		this.controllers = {};

    this.passport = passport;
    this.mailer = sgMail;

		this.init();
	}

	// Automatically detect and load our controllers.
	init() {
		this.express.engine('ejs', ejsMate);
		this.express.set('view engine', 'ejs');
		this.express.set('views', __dirname + '/../views');
		this.express.use(express.static('dist'));
		this.express.use(bodyParser.urlencoded({
	    extended: true
		}));
		this.express.use(bodyParser.json());

    this.express.use(cookieParser());

    this.express.use(config.session.handler);

    // mailer.extend(this.express, this.config.mail);
    this.mailer.setApiKey(this.config.mail.api);

    this.express.use(this.passport.initialize());
    this.express.use(this.passport.session());

		this.initControllers();
	}

	initControllers() {
		let defaultHandler = null;
		fs
		  .readdirSync(path.join(__dirname, '../controllers'))
		  .filter(file => {
		    return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
		  })
		  .forEach(file => {
		    let obj = require(path.join(__dirname, '../controllers', file));

		    this.controllers[obj.name] = new obj(this);
		    if(!this.controllers[obj.name].default) {
			    this.controllers[obj.name].handle();
			  }
			  else {
			  	defaultHandler = obj.name;
			  }
		  });

		  if(defaultHandler) {
		  	this.controllers[defaultHandler].handle();
		  }
	}

  authMiddleware(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    else {
      res.status(401).send({ message: 'Not authorized.' });
    }
  }

	run() {
		this.express.listen(process.env.PORT);
 		console.log('listening...');
	}
}

module.exports = App;
