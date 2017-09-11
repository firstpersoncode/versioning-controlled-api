const mongoose = require('mongoose');
const {Data, Drafts} = require('../../../source/schema');


module.exports = async (req, res) => {
  const {params, query} = req;
  const obj = req.body;
  let data = {
    key: params.key ? params.key : obj.key,
  };

  Drafts.delete(data);
  Data.delete(data, (deleted) => {
    res.status(200).json({deleted: data, status: deleted});
  });
}
