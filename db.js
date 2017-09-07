let data = [];
let drafts = [];

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

for (let i = 0; i < getRandomInt(0, 20); i++) {
  let obj = {
    key: generateKey(),
    value: i,
    timestamp: Math.floor(new Date() / 1000) + getRandomInt(0, 10),
  };

  // init random key
  data.push(obj);
  drafts.push(obj);
}

module.exports = {
  data,
  drafts,
}
