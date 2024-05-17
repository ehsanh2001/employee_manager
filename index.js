"use strict";

const logoWriter = require("./lib/logoWriter");
const menu = require("./lib/menu");

async function main() {
  do {
    try {
      var { mainMenu, subMenu } = await menu.userChoice();
      console.log("mainMenu:", mainMenu, "subMenu:", subMenu);
    } catch (error) {
      console.error("Error in function main");
      throw error;
    }
  } while (mainMenu !== "Exit");
}
main();
