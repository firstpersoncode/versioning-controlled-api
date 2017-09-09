const express = require('express');
const generate = require('./modules/generate');

const Router = express.Router();
Router.route("/generate/:count")
  .get(generate)

module.exports = Router;
