"use strict";

const UserInput = require("../user_input");
const inquirer = require("inquirer");

class ViewHandler {
  constructor(dbAccess) {
    this.dbAccess = dbAccess;

    this.viewActions = {
      "View All Employees": async () => this.dbAccess.getAll("employee"),
      "View All Roles": async () => this.dbAccess.getAll("role"),
      "View All Departments": async () => this.dbAccess.getAll("department"),
      "View Employees by Manager": async () => this.viewEmployeeByManager(),
      "View Employees by Department": async () =>
        this.viewEmployeesByDepartment(),
      "View Total Utilized Budget of a Department": async () =>
        this.viewTotalUtilizedBudget(),
    };
  }

  async handleView(subMenu) {
    try {
      const action = this.viewActions[subMenu];
      if (action) {
        const result = await action();
        console.table(result);
        await UserInput.pressAnyKey();
      }
    } catch (error) {
      console.error("Error in function view: " + error);
      throw error;
    }
  }

  // Get the list of managers from the database
  // Create a list of manager names for inquirer
  async #getManagerChoices() {
    // Get the list of managers from the database
    let managers = [];
    try {
      managers = await this.dbAccess.getManagers();
    } catch (error) {
      console.log("Error getting list of managers from databse");
      await UserInput.pressAnyKey();
      return;
    }
    // Create a list of manager names for inquirer
    return managers.map((manager) => {
      return { name: manager.manager_name, value: manager.id };
    });
  }

  async viewEmployeeByManager() {
    const managersChoices = await this.#getManagerChoices();
    const promptConfig = {
      title: "View Employees by Manager",
      questions: [
        {
          type: "list",
          name: "managerId",
          message: "Select the Manager :",
          choices: managersChoices,
        },
      ],
    };

    try {
      const { managerId } = await this.getUserData(promptConfig);
      return await this.dbAccess.getEmployeeByManager(managerId);
    } catch (error) {
      return this.handleError(error, "The Manager ID should be an integer");
    }
  }

  // Get the list of departments from the database
  // Create a list of department names for inquirer
  async #getDepartmentChoices() {
    // Get the list of departments from the database
    let departments = [];
    try {
      departments = await this.dbAccess.getAll("department");
    } catch (error) {
      console.log("Error getting list of departments from database");
      await UserInput.pressAnyKey();
      return;
    }
    // Create a list of department names for inquirer
    return departments.map((department) => {
      return { name: department.name, value: department.id };
    });
  }

  async viewEmployeesByDepartment() {
    const departmentChoices = await this.#getDepartmentChoices();
    const promptConfig = {
      title: "View Employees by Department",
      questions: [
        {
          type: "list",
          name: "departmentId",
          message: "Select the Department :",
          choices: departmentChoices,
        },
      ],
    };

    try {
      const { departmentId } = await this.getUserData(promptConfig);
      return await this.dbAccess.getEmployeeByDepartment(departmentId);
    } catch (error) {
      return this.handleError(error, "The Department ID should be an integer");
    }
  }

  async viewTotalUtilizedBudget() {
    const departmentChoices = await this.#getDepartmentChoices();
    const promptConfig = {
      title: "Total Utilized Budget",
      questions: [
        {
          type: "list",
          name: "departmentId",
          message: "Select the Department:",
          choices: departmentChoices,
        },
      ],
    };

    try {
      const { departmentId } = await this.getUserData(promptConfig);
      return await this.dbAccess.getTotalUtilizedBudget(departmentId);
    } catch (error) {
      return this.handleError(error, "The Department ID should be an integer");
    }
  }

  async getUserData(promptConfig) {
    const userInput = new UserInput.UserInput(
      promptConfig.title,
      promptConfig.questions
    );
    await userInput.getUserData();
    return userInput.answers;
  }

  handleError(error, customMessage) {
    if (error.message.includes("Error getting records from 'employee' table")) {
      return [{ message: customMessage }];
    }
    throw error;
  }
}

module.exports = ViewHandler;
