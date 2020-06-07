const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, require: true, unique: true, match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/ },
    password: { type: String, require: true },
    firstname: { type: String },
    lastname: { type: String },
    country: { type: String },
    dateOfBirth: { type: String},
    gamesPlayed: { type: Number, required: true, default: 0 },
    gamesWon: { type: Number, required: true, default: 0 },
    gamesLost: { type: Number, required: true, default: 0 },
    gamesDraw: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    experience: { type: Number, required: true, default: 0 },
    createdAt: { type: String, required: true, default: 0 }
});

module.exports = mongoose.model('User', userSchema);