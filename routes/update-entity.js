const {data, drafts} = require('../db');

module.exports = (req, res) => {
  const obj = req.body;
  let result;
  let newData;

  for (key in obj) {
    // check if key already exist
    result = data.filter((d) => {
      return d['key'] === key
    }).pop()

    if (result) { // key exist
      const draftData = Object.assign({}, result); // create draft item and push to drafts
      drafts.push(draftData);
      result.value = obj[key]; // change value
      result.timestamp = Math.floor(new Date() / 1000); // update timestamp
    } else {
      // new item
      newData = {
        key: Object.keys(obj)[0],
        value: obj[key],
        timestamp: Math.floor(new Date() / 1000)
      }
      drafts.push(newData);
      data.push(newData);
    }
  }

  res.status(200).send({result, newData});
}
