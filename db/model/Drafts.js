const mongoose = require('mongoose');

const draftSchema = mongoose.Schema({
  key: String,
  value: String,
  timestamp: {
    type: Number,
    default: Math.floor(new Date(Date.now()) / 1000)
  }
});

const drafts = mongoose.model('Drafts', draftSchema);
module.exports = drafts;
