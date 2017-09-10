const _ = require('lodash');
const {Data, Drafts} = require('../../../db/schema');
const closest = require('../../../libs/closest');
const {validation, message} = require('../../../libs/validate');

module.exports = async (req, res, next) => {
  const {params, query} = req;

  if (params.key) {
    let data;
    let resultData = await Data.find('key', params.key);
    let resultDraft = await Drafts.find('key', params.key);;

    // grab from data and draft, merge, remove duplicate object with same timestamp,
    //order the result for easily get the closest result
    const concatData = resultData.concat(resultDraft);
    const uniqData = _.uniqBy(concatData, (e) => e.timestamp);
    data = _.orderBy(uniqData, ['timestamp'], [query.order && _.includes(['asc', 'desc'], query.order) ? query.order : 'desc'])

    // for query string timestamp
    if (query.timestamp) {
      let order = _.orderBy(uniqData, ['timestamp'], ['asc']); // order result
      data = closest(order, Number(query.timestamp), 'timestamp');
      res.status(200).json(validation.invalidResult(data.closest) ? {data: message.invalidResult} : {data});
    }

    res.status(200).json(validation.invalidLength(data) ? {data: message.invalidResult} : {data});
  } else {
    let data = await Data.get();
    let result = _.orderBy(data, ['timestamp'], [query.order && _.includes(['asc', 'desc'], query.order) ? query.order : 'desc']); // order result
    res.status(200).json(validation.invalidLength(result) ? {data: message.invalidLength} : {data: result});
  }
}
