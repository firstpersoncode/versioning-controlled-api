const mongoose = require('mongoose');
const Drafts = require('../dataConstructor');

const draftSchema = new mongoose.Schema({
  _id: String,
  key: String,
  value: String,
  timestamp: {
    type: Number,
    default: Math.floor(new Date() / 1000)
  }
});


module.exports = new Drafts(process.env.NODE_ENV === "nodb" ? [] : mongoose.model('Drafts', draftSchema));
