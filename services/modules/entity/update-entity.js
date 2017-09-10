const mongoose = require('mongoose');

const {Data, Drafts} = require('../../../db/schema');
const generateKey = require('../../../libs/generateKey');

module.exports = async (req, res) => {

  const obj = req.body;
  const key = Object.keys(obj)[0];

  let data = {
    _id: generateKey("numOnly"),
    key,
    value: obj[key],
    timestamp: Math.floor(new Date() / 1000)
  };

  // optional properties
  for (let k in obj) {
    if (k !== key) {
      data[k] = obj[k]
    }
  }


  Drafts.add(Object.assign(data, {_id: generateKey("numOnly")}));

  const result = await Data.update('key', key, data);
  res.status(200).json({data: result});

}
