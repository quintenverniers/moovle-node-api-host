const mongoose = require('mongoose');

const gameSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    teamSize: { type: Number, required: true },
    totalSpots: { type: Number, required: true },
    spotsLeft: { type: Number, required: true },
    date: { type: Number, required: true },
    startTime: { type: String, required: true },
    duration: { type: String, required: true },
    location: { type: String, required: true },
    pitchType: { type: String, required: true },
    venueType: { type: String, required: true },
    payingGame: { type: Boolean, required: true },
    entryPrice: { type: Number, required: true },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Number, required: true },
    updatedAt: { type: Number, required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Game', gameSchema);