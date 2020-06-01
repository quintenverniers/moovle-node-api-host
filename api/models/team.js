const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    owner: { type: String, required: true },
    teamstats: { type: mongoose.Schema.Types.ObjectId, ref: 'Teamstats', required: true },
    teamImage: { type: String, required: false}
});

module.exports = mongoose.model('Team', teamSchema);