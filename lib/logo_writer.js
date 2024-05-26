const art = require("ascii-art");

// Makes the ascii-art.font() method return a promise
// Writes text to the console in ascii-art
async function writeText(text, color = "white") {
  return new Promise((resolve, reject) => {
    art.font(text, "Doom", (err, rendered) => {
      if (err) {
        reject(err);
      } else {
        console.log(art.style(rendered, color));
        resolve();
      }
    });
  });
}

module.exports = {
  writeText,
};
