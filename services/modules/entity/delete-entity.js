const mongoose = require('mongoose');
const {Data, Drafts} = require('../../../db/model');

module.exports = async (req, res) => {
  const obj = req.body;
  let data = {
    key: obj.key,
  };

  Drafts.delete(data);
  Data.delete(data, (deleted) => {
    res.status(200).json({deleted: data, status: deleted});
  });
}
