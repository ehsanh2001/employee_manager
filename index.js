"use strict";

const logoWriter = require("./lib/logo_writer");
const menu = require("./lib/menu");
const db = require("./lib/db_access");
const inquirer = require("inquirer");

// When user chooses to view data, this function will be called
// Exracts data from database and display it in a table
async function handleView(subMenu) {
  let result;
  try {
    switch (subMenu) {
      case "View All Employees":
        result = await dbAccess.getAll("employee");
        break;
      case "View All Roles":
        result = await dbAccess.getAll("role");
        break;
      case "View All Departments":
        result = await dbAccess.getAll("department");
        break;
      default:
        console.log("Invalid choice");
    }

    console.table(result);
    await pressAnyKey();
  } catch (error) {
    console.error("Error in function view" + error);
    throw error;
  }
}

// waits for user input before continuing
async function pressAnyKey() {
  await inquirer.prompt([
    {
      type: "input",
      name: "continue",
      message: "(Press any key to continue)",
      // This will ensure that inquirer does not wait for the user to type something
      // We are only using inquirer to capture a keypress event
      filter: () => true,
    },
  ]);
}

// Base on the mainMenu choice, this function will call the appropriate function
// The processing of the subMenu choice will be done in the called function
async function handleUserChoice(mainMenu, subMenu) {
  switch (mainMenu) {
    case "View":
      await handleView(subMenu);
      break;
    case "Add":
      handleAdd(subMenu);
      break;
    case "Update":
      handleUpdate(subMenu);
      break;
    case "Delete":
      handleDelete(subMenu);
      break;
    case "Exit":
      console.log("Goodbye!");
      process.exit();
      break;
    default:
      console.log("Invalid choice");
  }
}

// The starting point of the application
async function main() {
  do {
    try {
      var { mainMenu, subMenu } = await menu.userChoice();
      await handleUserChoice(mainMenu, subMenu);
    } catch (error) {
      console.error("Error in function main");
      throw error;
    }
  } while (mainMenu !== "Exit");
}

// Create a new instance of the DbAccess class
// The database connection is established in the constructor using the environment variables
const dbAccess = new db.DbAccess();

main();

// When the application is done, end the connection to the database
dbAccess.end();
