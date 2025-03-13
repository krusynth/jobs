'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const mailer = require('express-mailer');
// const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const passport = require('../lib/passport');

const userDataMiddleware = require('../lib/middleware/userData');
const sassMiddleware = require('node-sass-middleware');

const config = require('../config.js');

const sgMail = require('@sendgrid/mail');

class App {

	constructor(config) {
    this.config = config;

		this.express = express();
		this.preMiddleware = [this.viewMiddleware];
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
    this.express.use(this.passport.initialize());
		this.express.use(this.passport.session());

    this.express.use(userDataMiddleware);
    this.express.use(sassMiddleware({
	    src: path.join(__dirname, '../../assets/scss/'),
	    dest: path.join(__dirname, '../../assets/css/'),
	    debug: true,
	    // outputStyle: 'compressed',
	    prefix:  '/assets/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
		}));
		this.express.use('/assets', express.static(path.join(__dirname, '../../assets')));

    this.mailer.setApiKey(this.config.mail.api);

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
		    if(this.controllers[obj.name].default) {
		    	defaultHandler = obj.name;
			  }
			  else {
					this.controllers[obj.name].handle();
			  }
		  });

		  if(defaultHandler) {
		  	this.controllers[defaultHandler].handle();
		  }
	}

	viewMiddleware(req, res, next) {
		res.locals.message = req.query.message ? req.query.message : '';

		next();
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
