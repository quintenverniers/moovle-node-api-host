const mongoose = require('mongoose');

const teamStatsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    gamesPlayed: Number,
    gamesWon: Number,
    gamesLost: Number,
    gamesDraw: String,
    goalsScored: Number,
    goalsReceived: Number,
    rating: String,
    level: Number
});

module.exports = mongoose.model('Teamstats', teamStatsSchema);