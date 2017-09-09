const mongoose = require('mongoose');
const {Data, Drafts} = require('../db/model');

module.exports = async (req, res) => {
  const {params} = req;
  // generate random keys in database

  const data = await Data.random(params.count);
  res.status(200).json({data})
}
