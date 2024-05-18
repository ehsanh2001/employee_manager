const art = require("ascii-art");

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
