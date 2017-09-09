const mongoose = require('mongoose');
const debug = require('debug')
const log = debug('>')
// connect database
const open = (db) => {
  return mongoose.connect(db, (err) => {
    if(err) {
      log(err)
    }else {
      log('Connected to database', db)
    }
  });
}

const close = () => {
  return mongoose.disconnect((err) => {
    if(err) {
      log(err)
    }else {
      log('Disconnected from database')
    }
  });
}

module.exports = {
  open,
  close
}
