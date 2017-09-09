const fs = require('fs');
const express = require('express');
const _ = require('lodash');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const debug = require('debug')
const log = debug('debug')

const {entity, generate} = require('./services');

// set up
if (process.env.NODE_ENV !== "nodb") {
  const {open} = require('./db');
  open('mongodb://localhost/keys-api');
}

const app = express();

app.use(cors());
app.use('*', cors());
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(entity);
app.use(generate);

const PORT = process.env.PORT || 5000;
module.exports = app.listen(PORT, () => {
  log('app running on PORT:', PORT)
});
