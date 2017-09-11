const express = require('express');
const generate = require('./modules/generate');

const Router = express.Router();
Router.route("/generate/:count")
  .post(generate)

module.exports = Router;
