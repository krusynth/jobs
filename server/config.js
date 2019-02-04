const session = require('express-session');
const FileStore = require('session-file-store')(session);

require('dotenv').load();


// if(typeof(process.env.LOADED) === 'undefined') {
//   if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').load();
//   }
//   process.env.LOADED = true;
// }

// Since everything is in .env we don't need nested [env]s
const config = {
  db: {
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  },
  session: {
    secret: process.env.SESSION_SECRET,
    iterations: process.env.PW_ITERATIONS,
    method: process.env.PW_METHOD,
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 7*24*60*60*1000 // 1 Week
    },
    store: new FileStore({
      // TODO: Put this in config
      path: '/tmp/sessions'
    })
  },
  mail: {
    from: process.env.MAIL_FROM,
    host: process.env.MAIL_HOST,
    secureConnection: process.env.MAIL_SSL !== 'false',
    port: process.env.MAIL_PORT,
    transportMethod: process.env.MAIL_METHOD,
  }
};

// Create a handler for our sessions.
config.session.handler = session(config.session);

if(process.env.MAIL_USER && process.env.MAIL_PASSWORD) {
  config.mail.auth = {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  };
}

// Patch for sequelize command line.
config.development = config.db;

module.exports = config;
