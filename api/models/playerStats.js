const mongoose = require('mongoose');

const playerStatsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    gamesPlayed: Number,
    gamesWon: Number,
    gamesLost: Number,
    gamesDraw: String,
    rating: String,
    experience: Number,
});

module.exports = mongoose.model('Playerstats', playerStatsSchema);