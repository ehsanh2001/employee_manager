"use strict";

const logoWriter = require("./lib/logo_writer");
const { Menu, CascadingMenu } = require("./lib/menu");
const db = require("./lib/db_access");
const inquirer = require("inquirer");
const MenuHandler = require("./lib/menu_handler");
const menuItems = require("./lib/menu/menu_items.json");

// The main loop of the application
async function appLoop(menu, menuHandler) {
  do {
    try {
      var { mainMenu, subMenu } = await menu.prompt();
      await menuHandler.handle(mainMenu, subMenu);
    } catch (error) {
      throw error;
    }
  } while (mainMenu !== "Exit");
}

async function main() {
  try {
    const dbAccess = new db.DbAccess();
    await dbAccess.testDb();

    const menu = new CascadingMenu(menuItems, "Employee Tracker");
    const menuHandler = new MenuHandler(dbAccess);

    await appLoop(menu, menuHandler);

    await dbAccess.end();
  } catch (error) {
    console.error("Error in function asyncMain" + error);
    console.log(error);
  }
}

main();
