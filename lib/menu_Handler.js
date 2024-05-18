"use strict";

const inquirer = require("inquirer");
const UserInput = require("./user_input");

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
        case "View Employees by Manager":
          result = await this.viewEmployeeByManager();
          break;
        case "View Employees by Department":
          result = await this.viewEmployeesByDepartment();
          break;
        case "View Total Utilized Budget of a Department":
          result = await this.viewTotalUtilizedBudget();
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

  async viewEmployeeByManager() {
    const inquirerQuestions = [
      {
        type: "input",
        name: "managerId",
        message: "Enter the Manager ID:",
      },
    ];

    const userInput = new UserInput(
      "View Employees by Manager",
      inquirerQuestions
    );

    try {
      await userInput.getUserData();

      let result = await this.dbAccess.getEmployeeByManager(
        userInput.answers.managerId
      );
      return result;
    } catch (error) {
      if (
        error.message.includes("Error getting records from 'employee' table")
      ) {
        let result = [{ message: "The Manager ID should be an integer" }];
        return result;
      }
      throw error;
    }
  }

  async viewEmployeesByDepartment() {
    const inquirerQuestions = [
      {
        type: "input",
        name: "departmentId",
        message: "Enter the Department ID:",
      },
    ];

    const userInput = new UserInput(
      "View Employees by Department",
      inquirerQuestions
    );

    try {
      await userInput.getUserData();

      let result = await this.dbAccess.getEmployeeByDepartment(
        userInput.answers.departmentId
      );
      return result;
    } catch (error) {
      if (
        error.message.includes("Error getting records from 'employee' table")
      ) {
        let result = [{ message: "The Department ID should be an integer" }];
        return result;
      }
      throw error;
    }
  }

  async viewTotalUtilizedBudget() {
    const inquirerQuestions = [
      {
        type: "input",
        name: "departmentId",
        message: "Enter the Department ID:",
      },
    ];

    const userInput = new UserInput(
      "Total  Utilized  Budget",
      inquirerQuestions
    );

    try {
      await userInput.getUserData();

      let result = await this.dbAccess.getTotalUtilizedBudget(
        userInput.answers.departmentId
      );
      return result;
    } catch (error) {
      if (
        error.message.includes("Error getting records from 'employee' table")
      ) {
        let result = [{ message: "The Department ID should be an integer" }];
        return result;
      }
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
