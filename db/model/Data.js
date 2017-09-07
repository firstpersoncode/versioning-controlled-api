const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
  key: String,
  value: String,
  timestamp: {
    type: Number,
    default: Math.floor(new Date(Date.now()) / 1000)
  }
});

let data;

if (process.env.NODE_ENV === "nodb") {
  data = []; // return array if no mongoDB
} else {
  data = mongoose.model('Data', dataSchema);
}

module.exports = data;
