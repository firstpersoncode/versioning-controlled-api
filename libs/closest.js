const keysHelper = require('./keysHelper');
// function to get the closest timestamp of object
module.exports = (arr, closestTo, attr, query) => {
  let lowest, highest;
  for (let i = arr.length; i--;) {
    if (arr[i][attr] == closestTo) {
      return {compare: [], closest: query ? keysHelper(arr[i], query) : arr[i]}
    } else {
      if (arr[i][attr] <= closestTo && (lowest === undefined || lowest < arr[i][attr])) lowest = arr[i];
      if (arr[i][attr] >= closestTo && (highest === undefined || highest > arr[i][attr])) highest = arr[i];
    }
  }


  return {compare: [{lowest: query ? keysHelper(lowest, query) : lowest}, {highest: query ? keysHelper(highest, query) : highest}], closest: query ? keysHelper(lowest, query) : lowest};
}
