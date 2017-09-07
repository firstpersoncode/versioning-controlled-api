const fs = require('fs');
const express = require('express');
const _ = require('lodash');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const {data, drafts} = require('./db');
const {fetchEntity, updateEntity} = require('./routes');

// set up
const app = express();
app.use(cors());
app.use('*', cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.post("/", updateEntity);
app.get("/:key", fetchEntity);
app.get("/", (req, res) => {
  res.status(200).send(data)
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('app running on PORT:', PORT)
});

module.exports = app;
