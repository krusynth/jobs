const express = require('express');
const router = express.Router();

const Home = require('./modules/home');

router.get('/', Home);

module.exports = router;