const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
  key: String,
  value: String,
  timestamp: {
    type: Number,
    default: Math.floor(new Date(Date.now()) / 1000)
  }
});

const data = mongoose.model('Data', dataSchema);
module.exports = data;
