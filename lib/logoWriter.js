const art = require("ascii-art");

async function writeText(text) {
  return new Promise((resolve, reject) => {
    art.font(text, "Doom", (err, rendered) => {
      if (err) {
        reject(err);
      } else {
        console.log(rendered);
        resolve();
      }
    });
  });
}

module.exports = {
  writeText,
};
