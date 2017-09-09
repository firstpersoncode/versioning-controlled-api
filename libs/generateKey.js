// generate random key
module.exports = (opt) => {
  let text = "";
  let possible;
  if (opt === "numOnly") {
    possible = "0123456789";
  } else {
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  }

  for (let i = 0; i < 30; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}
