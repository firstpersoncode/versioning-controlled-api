const mongoose = require('mongoose');
const Data = require('../dataConstructor');

const dataSchema = new mongoose.Schema({
  _id: String,
  key: String,
  value: String,
  timestamp: {
    type: Number,
    default: Math.floor(new Date() / 1000)
  }
});


module.exports = new Data(process.env.NODE_ENV === "nodb" ? [] : mongoose.model('Data', dataSchema));
