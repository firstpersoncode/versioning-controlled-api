const _ = require('lodash');

module.exports.message = {
  invalidKey: 'Sorry, you can\'t use that key.',
  invalidLength: 'Oops, your search return zero !, make sure your key parameter is correct, or try to add new item from POST method: {mykey: value}, or use "generate" as paramater and give amount of items to be generated: /generate/5',
  invalidResult: 'Oops, something went wrong, there is no item that you\'re looking for',
  invalidCount: 'limited to 25 items each generate',
  invalidDelete: 'No item to be deleted, try another one..'
}

module.exports.validation = {
  invalidKey: (key) => _.includes(['asc', 'desc', '*', 'generate', '', 'key'], key),
  invalidLength: (result) => !result.length,
  invalidResult: (result) => result === null || result === undefined || result < 0 || !result,
  invalidDelete: (result) => process.env.NODE_ENV === "nodb" ? !result.length : data.n < 1
}
