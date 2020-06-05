const mongoose = require('mongoose');

const playerStatsSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    gamesPlayed: { type: Number, required: true, default: 0 },
    gamesWon: { type: Number, required: true, default: 0 },
    gamesLost: { type: Number, required: true, default: 0 },
    gamesDraw: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    experience: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('Playerstats', playerStatsSchema);