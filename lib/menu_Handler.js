"use strict";

const inquirer = require("inquirer");

class MenuHandler {
  constructor(dbAccess) {
    this.dbAccess = dbAccess;
  }

  // When mainMenu choice is View this method will be called
  // Exracts data from database and display it in a table
  async #handleView(subMenu) {
    let result;
    try {
      switch (subMenu) {
        case "View All Employees":
          result = await this.dbAccess.getAll("employee");
          break;
        case "View All Roles":
          result = await this.dbAccess.getAll("role");
          break;
        case "View All Departments":
          result = await this.dbAccess.getAll("department");
          break;
        default:
          console.log("Invalid choice");
      }

      console.table(result);
      await this.#pressAnyKey();
    } catch (error) {
      console.error("Error in function view" + error);
      throw error;
    }
  }

  // waits for user input before continuing
  async #pressAnyKey() {
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
  async handle(mainMenu, subMenu) {
    switch (mainMenu) {
      case "View":
        await this.#handleView(subMenu);
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
}

module.exports = MenuHandler;
