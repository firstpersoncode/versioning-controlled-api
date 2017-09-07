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
  let resultData;
  let resultDraft;
  if (params.key) {

    // without mongoDB
    if (process.env.NODE_ENV === "nodb") {
      resultData = Data.filter((d) => d.key === params.key);
      resultDraft = Drafts.filter((d) => d.key === params.key);

    // with mongoDB
    } else {
      resultData = await Data.find({'key': params.key}, (err, data) => {
        if (err)
          throw err;

        return data
      });
      resultDraft = await Drafts.find({'key': params.key}, (err, drafts) => {
        if (err)
          throw err;

        return drafts;
      });
    }

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

    res.status(200).json({data: result, result: result.lowest});
  } else {

    // without mongoDB
    if (process.env.NODE_ENV === "nodb") {
      res.status(200).json({data: Data});

    // with mondoDB
    } else {
      let resultData = await Data.find({}, (err, data) => {
        if (err)
          throw err;

        return data
      });
      res.status(200).json({data: resultData});
    }
  }
}
