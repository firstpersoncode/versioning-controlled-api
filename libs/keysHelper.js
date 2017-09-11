const _ = require('lodash');

module.exports = (keysData, query) => {
  if (!query.keys) {
    return keysData;
  }

  const {keys} = query;
  const key = keys.split("|");
  if (keysData.length) {
    return keysData.map((data) => {
      return _.pick(data, key)
    })
  } else {
    return _.pick(keysData, key)
  }
}
