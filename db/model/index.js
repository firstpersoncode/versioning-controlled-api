const Data = require('./Data');
const Drafts = require('./Drafts');

// generate random key
const generateKey = () => {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 30; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

for (let i = 0; i < getRandomInt(5, 25); i++) {

  const newData = {
    key: generateKey(),
    value: i,
    timestamp: Math.floor(new Date() / 1000) + (i * 5)
  }

  // init random key
  if (process.env.NODE_ENV === "nodb") {
    Data.push(newData);
    Drafts.push(newData);
  } else {
    const update = new Data(newData);
    update.save().then((update) => {
      console.log('new data saved', update);
    });
  }
}

module.exports = {
  Data,
  Drafts,
};
