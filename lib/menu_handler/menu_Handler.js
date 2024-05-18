"use strict";

const inquirer = require("inquirer");
const UserInput = require("../user_input");

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
          result = await this.#viewEmployeeByManager();
          break;
        case "View Employees by Department":
          result = await this.#viewEmployeesByDepartment();
          break;
        case "View Total Utilized Budget of a Department":
          result = await this.#viewTotalUtilizedBudget();
          break;
        default:
          return;
      }

      console.table(result);
      await this.#pressAnyKey();
    } catch (error) {
      console.error("Error in function view" + error);
      throw error;
    }
  }

  async #viewEmployeeByManager() {
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

  async #viewEmployeesByDepartment() {
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

  async #viewTotalUtilizedBudget() {
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

  // When mainMenu choice is Add this method will be called
  async #handleAdd(subMenu) {
    try {
      switch (subMenu) {
        case "Add Employee":
          await this.#addEmployee();
          break;
        case "Add Role":
          await this.#addRole();
          break;
        case "Add Department":
          await this.#addDepartment();
          break;
        default:
          return;
      }
    } catch (error) {
      console.error("Error in function view" + error);
      throw error;
    }
  }

  // Get the role title and id to be used in the add employee function as the choices for the inquerer prompt
  async #getRoleChoices() {
    let roleChoices;
    try {
      const roles = await this.dbAccess.getAll("role");
      roleChoices = roles.map((role) => {
        return { name: role.title, value: role.id };
      });
      return roleChoices;
    } catch (error) {
      console.log("Error getting role list");
      await this.#pressAnyKey();
      throw error;
    }
  }

  // Get the managers name and id to be used in the add employee function as the choices for the inquerer prompt
  async #getManagerChoices() {
    let managerChoices;
    try {
      const managers = await this.dbAccess.getAll("employee");
      managerChoices = managers.map((manager) => {
        return {
          name: manager.first_name + " " + manager.last_name,
          value: manager.id,
        };
      });
      managerChoices.unshift({ name: "None", value: null });
      return managerChoices;
    } catch (error) {
      console.log("Error getting manager list");
      await this.#pressAnyKey();
      throw error;
    }
  }

  async #addEmployee() {
    let roleChoices, managerChoices;
    try {
      roleChoices = await this.#getRoleChoices();
      managerChoices = await this.#getManagerChoices();
    } catch (error) {
      return;
    }

    const inquirerQuestions = [
      {
        type: "input",
        name: "firstName",
        message: "Enter the First Name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the Last Name:",
      },
      {
        type: "list",
        name: "roleId",
        message: "Enter the Role ID:",
        choices: roleChoices,
      },
      {
        type: "list",
        name: "managerId",
        message: "Enter the Manager ID:",
        choices: managerChoices,
        pageSize: 10,
      },
    ];

    const userInput = new UserInput("Add  Employee", inquirerQuestions);

    try {
      await userInput.getUserData();
      await this.dbAccess.addEmployee(userInput.answers);
      console.log("\n\n\tEmployee added successfully\n\n");
    } catch (error) {
      if (error.message.includes("violates foreign key constraint")) {
        console.log("Role ID or Manager ID does not exist");
      } else if (error.message.includes("violates not-null constraint")) {
        console.log("Role ID and Manager ID are required");
      } else {
        console.log(error.message);
      }
    } finally {
      await this.#pressAnyKey();
    }
  }

  // Get the department name and id to be used in the add role function as the choices for the inquerer prompt
  async #getDepartmentChoices() {
    let departmentChoices;
    try {
      const departments = await this.dbAccess.getAll("department");
      departmentChoices = departments.map((department) => {
        return { name: department.name, value: department.id };
      });
      return departmentChoices;
    } catch (error) {
      console.log("Error getting department list");
      await this.#pressAnyKey();
      throw error;
    }
  }
  async #addRole() {
    let departmentChoices;
    try {
      departmentChoices = await this.#getDepartmentChoices();
    } catch (error) {
      return;
    }
    const inquirerQuestions = [
      {
        type: "input",
        name: "title",
        message: "Enter the Role Title:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the Role Salary:",
      },
      {
        type: "list",
        name: "departmentId",
        message: "Enter the Department ID:",
        choices: departmentChoices,
      },
    ];

    const userInput = new UserInput("Add  Role", inquirerQuestions);

    try {
      await userInput.getUserData();
      await this.dbAccess.addRole(userInput.answers);
      console.log("\n\n\tRole added successfully\n\n");
    } catch (error) {
      if (error.message.includes("violates foreign key constraint")) {
        console.log("Department ID does not exist");
      } else if (error.message.includes("violates not-null constraint")) {
        console.log("Title, Salary and Department ID are required");
      } else {
        console.log(error.message);
      }
    } finally {
      await this.#pressAnyKey();
    }
  }

  async #addDepartment() {
    const inquirerQuestions = [
      {
        type: "input",
        name: "name",
        message: "Enter the Department Name:",
      },
    ];

    const userInput = new UserInput("Add  Department", inquirerQuestions);

    try {
      await userInput.getUserData();
      await this.dbAccess.addDepartment(userInput.answers);
      console.log("\n\n\tDepartment added successfully\n\n");
    } catch (error) {
      console.log(error.message);
    } finally {
      await this.#pressAnyKey();
    }
  }

  // When mainMenu choice is Update this method will be called
  async #handleUpdate(subMenu) {
    try {
      switch (subMenu) {
        case "Update Employee Role":
          //       await this.#updateEmployeeRole();
          break;
        case "Update Employee Manager":
          //     await this.#updateEmployeeManager();
          break;
        default:
          return;
      }
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
        await this.#handleAdd(subMenu);
        break;
      case "Update":
        this.#handleUpdate(subMenu);
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
