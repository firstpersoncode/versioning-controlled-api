const _ = require('lodash');
const {Data, Drafts} = require('../../../source/schema');
const closest = require('../../../libs/closest');
const {validation, message} = require('../../../libs/validate');
const keysHelper = require('../../../libs/keysHelper');
const filterHelper = require('../../../libs/filterHelper');

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
    data = _.orderBy(uniqData, ['timestamp'], [query.order && _.includes(['asc', 'desc'], query.order) ? (query.filter ? 'asc' : query.order) : (query.filter ? 'asc' : 'desc')])

    // for query string timestamp
    if (query.timestamp) {
      let order = _.orderBy(uniqData, ['timestamp'], ['asc']); // order result
      data = closest(order, Number(query.timestamp), 'timestamp', query);

      res.status(200).json(validation.invalidResult(data.closest) ? {data: message.invalidResult} : {data});
    }

    res.status(200).json(validation.invalidLength(data) ? {data: message.invalidResult} : {data: filterHelper(keysHelper(data, query), query)});
  } else {
    let data = await Data.get();
    let result = _.orderBy(data, ['timestamp'], [query.order && _.includes(['asc', 'desc'], query.order) ? (query.filter ? 'asc' : query.order) : (query.filter ? 'asc' : 'desc')]); // order result

    res.status(200).json(validation.invalidLength(result) ? {data: message.invalidLength} : {data: filterHelper(keysHelper(result, query), query)});
  }
}
