const mongoose = require('mongoose');
const {Data, Drafts} = require('../../../db/schema');

module.exports = async (req, res) => {
  const {params} = req;
  // generate random items in database
  // no need to generate random items in Drafts
  const data = await Data.random(params.count);
  res.status(200).json({data})
}
