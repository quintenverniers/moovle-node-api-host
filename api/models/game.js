const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    teamSize: Number,
    spotsLeft: Number,
    date: Date,
    startTime: String,
    duration: String,
    pitchType: String,
    venueType: String,
    payingGame: Boolean,
    entryPrice: Number,
    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model('Game', gameSchema);