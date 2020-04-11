const express = require('express');
const app = express();

const gamesRoutes = require('./api/routes/games');

app.use('/games', gamesRoutes);

module.exports = app;