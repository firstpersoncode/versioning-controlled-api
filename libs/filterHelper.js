module.exports = (filterData, query) => {
  let data;
  switch (query.filter) {
    case 'newest': {
      data = filterData.length ? filterData.pop() : filterData;
      break;
    }
    case 'oldest': {
      data = filterData.length ? filterData[0] : filterData;
      break;
    }
    default: {
      return filterData
    }
  }
  return data
}
