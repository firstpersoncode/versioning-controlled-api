const {data, drafts} = require('../db');
const _ = require('lodash');

// function to get the closest timestamp of object
const closest = (arr, attr, closestTo) => {

  const arrayMax = (arr, key) => {
    let m = -Infinity, cur, i;
    for(let i=0; i<arr.length; i++){
        cur = arr[i][key]
        if(cur > m){
            m = cur;
        }
    }
    return m;
  }

  let close = arrayMax(arr, attr); //Get the highest number in arr in case it match nothing.

  for(let i = 0; i < arr.length; i++){ //Loop the array
      if (arr[i][attr] >= closestTo && arr[i][attr] <= close) {
        close = arr[i]; //Check if it's higher than your number, but lower than your closest value
      }
  }

  return close;
}

module.exports = (req, res) => {
  const {params, query} = req;
  let resultData = data.filter((d) => d.key === params.key);
  let resultDraft = drafts.filter((d) => d.key === params.key);
  // grab from data and draft, merge, remove duplicate object with same timestamp,
  //order the result for easily get the closest result
  let result = resultData.concat(resultDraft);
  result = _.uniqBy(result, (e) => {
    return e.timestamp;
  });
  result = _.orderBy(result, ['timestamp'], ['asc']); // order result

  if (result.length) {
    result = result[result.length - 1]; // always return the last item in array, (latest timestamp)

    // for query string timestamp
    if (Object.keys(query).length) {
      result = closest(result, 'timestamp', Number(query.timestamp));
    }
  }

  res.status(200).send(result);
}
