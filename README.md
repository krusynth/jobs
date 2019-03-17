# Jobs CRM

![Jobs CRM Screenshot](https://raw.githubusercontent.com/wiki/krues8dr/jobs/jobs-crm.gif)

## Installation & Setup

1. Install required packages using `yarn install` or `npm install`.
2. Create a database of your preferred flavor. The site has been tested with PostgreSQL, other standard SQL dbs should work but may have issues.
3. Copy `.env.example` to `.env` and add your settings.
4. Run `npm run sequelize db:migrate` to create the necessary database tables.
5. Run `npm run sequelize db:seed` to set the initial data.
6. Run `./node_modules/.bin/webpack` to compile the assets.

To serve the site via the installed `nodemon` server, run `npm start`.  You may also run via `PM2` if you have it installed by running `pm2 start server.pm2.json`
