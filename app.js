const express = require('express');
const app = express();

const gamesRouters = require('./api/routes/games');

app.use('/products', productRouters);

module.exports = app;