const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teamImage: { type: String, required: false},
    gamesPlayed: { type: Number, required: true, default: 0 },
    gamesWon: { type: Number, required: true, default: 0 },
    gamesLost: { type: Number, required: true, default: 0 },
    gamesDraw: { type: Number, required: true, default: 0 },
    goalsScored: { type: Number, required: true, default: 0 },
    goalsReceived: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    level: { type: Number, required: true, default: 0 }
});

module.exports = mongoose.model('Team', teamSchema);