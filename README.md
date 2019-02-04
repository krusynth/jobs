# Jobs

* Requires a database.

Install per usual with `yarn install`.

Create a database of your preferred flavor. Then copy `.env.example` to `.env`
and configure it. The site has been tested with PostgreSQL, other standard SQL
dbs should work but may have issues.

Run `npm run sequelize db:migrate` to create the necessary tables then
`npm run sequelize db:seed` to set the initial data.

To compile the assets, run `webpack` or `webpack --watch`.

To serve the site, run `npm start`.
