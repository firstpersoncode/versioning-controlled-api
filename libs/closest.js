// function to get the closest timestamp of object
module.exports = (arr, closestTo, attr) => {
  let lowest, highest;
  for (let i = arr.length; i--;) {
      if (arr[i][attr] <= closestTo && (lowest === undefined || lowest < arr[i][attr])) lowest = arr[i];
      if (arr[i][attr] >= closestTo && (highest === undefined || highest > arr[i][attr])) highest = arr[i];
  };
  return {lowest, highest, closest: lowest};
}
