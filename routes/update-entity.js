const mongoose = require('mongoose');
const {Data, Drafts} = require('../db/model');
const generateKey = require('../libs/generateKey');

module.exports = async (req, res) => {
  const obj = req.body;
  const key = Object.keys(obj)[0];
  const data = {
    _id: generateKey("numOnly"),
    key,
    value: obj[key],
    timestamp: Math.floor(new Date() / 1000)
  };

  Drafts.add(Object.assign(data, {_id: generateKey("numOnly")}), (result) => {
    console.log('success create draft', result)
  });

  const result = await Data.update('key', key, data);
  res.status(200).json({data: result});
}
