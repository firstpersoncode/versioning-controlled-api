module.exports = (functionToCheck) => {
 const getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
