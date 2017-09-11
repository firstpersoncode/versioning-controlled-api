const express = require('express');
const {fetchEntity, updateEntity, deleteEntity} = require('./modules/entity');

const Router = express.Router();
Router.route('/:key?')
  .get(fetchEntity)
  .post(updateEntity)
  .delete(deleteEntity)

module.exports = Router;
