const express = require('express');
const app = express();

const gamesRoutes = require('./api/routes/games');
const teamRoutes = require('./api/routes/teams');

app.use('/games', gamesRoutes);
app.use('/teams', teamRoutes);

module.exports = app;