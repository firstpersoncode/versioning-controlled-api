const _ = require('lodash');
const {Data, Drafts} = require('../db/model');
const closest = require('../libs/closest');

module.exports = async (req, res, next) => {
  const {params, query} = req;

  if (params.key) {
    let resultData = await Data.find('key', params.key);
    let resultDraft = await Drafts.find('key', params.key);;


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
    res.status(200).json({data: result});
  } else {
    const data = await Data.get();
    res.status(200).json({data});
  }
}
