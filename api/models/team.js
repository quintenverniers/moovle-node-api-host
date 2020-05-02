const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    owner: String
});

module.exports = mongoose.model('Team', teamSchema);