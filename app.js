const express = require('express');
const app = express();
const morgan = require('morgan');

const gamesRoutes = require('./api/routes/games');
const teamRoutes = require('./api/routes/teams');

app.use(morgan('dev'));

app.use('/games', gamesRoutes);
app.use('/teams', teamRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports = app;