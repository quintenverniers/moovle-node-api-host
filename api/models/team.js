const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    owner: { type: String, required: true },
    teamstats: { type: mongoose.Schema.Types.ObjectId, ref: 'Teamstats', required: true },
});

module.exports = mongoose.model('Team', teamSchema);