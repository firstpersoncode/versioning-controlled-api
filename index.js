const fs = require('fs');
const express = require('express');
const _ = require('lodash');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const debug = require('debug')
const log = debug('>')

const {fetchEntity, updateEntity, randomEntity} = require('./routes');

// set up
if (process.env.NODE_ENV !== "nodb") {
  const {open} = require('./db');
  open('mongodb://localhost/keys-api');
}

const app = express();

app.use(cors());
app.use('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.post("/", updateEntity);
app.get("/:key?", fetchEntity);
app.get("/generate/:count", randomEntity);

const PORT = process.env.PORT || 5000;
module.exports = app.listen(PORT, () => {
  log('app running on PORT:', PORT)
});
