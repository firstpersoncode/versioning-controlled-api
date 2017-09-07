// const {data, drafts} = require('../db');
const {Data, Drafts} = require('../db/model');
const _ = require('lodash');


// function to get the closest timestamp of object
const closest = (arr, closestTo, attr) => {
  let lowest, highest;
  for (let i = arr.length; i--;) {
      if (arr[i][attr] <= closestTo && (lowest === undefined || lowest < arr[i][attr])) lowest = arr[i];
      if (arr[i][attr] >= closestTo && (highest === undefined || highest > arr[i][attr])) highest = arr[i];
  };
  return {lowest, highest};
}

module.exports = async (req, res, next) => {
  const {params, query} = req;
  if (params.key) {
    let resultData = await Data.find({'key': params.key}, (err, data) => {
      if (err)
        throw err;

      return data
    });
    let resultDraft = await Drafts.find({'key': params.key}, (err, drafts) => {
      if (err)
        throw err;

      return drafts;
    });
    // grab from data and draft, merge, remove duplicate object with same timestamp,
    //order the result for easily get the closest result
    let result = resultData.concat(resultDraft);
    result = _.uniqBy(result, (e) => e.timestamp);
    result = _.orderBy(result, ['timestamp'], ['asc']); // order result

    if (result.length) {
      // for query string timestamp
      if (Object.keys(query).length) {
        result = closest(result, Number(query.timestamp), 'timestamp');
      }
    }

    res.status(200).json({data: result, result: result.lowest, params});
  } else {
    let resultData = await Data.find({}, (err, data) => {
      if (err)
        throw err;

      return data
    });
    res.status(200).json({data: resultData, params});
  }
}
