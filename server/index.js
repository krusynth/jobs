const config = require('./config');

const App = require('./lib/app');

const app = new App(config);
app.run();
