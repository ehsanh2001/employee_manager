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

  async viewEmployeeByManager() {
    const promptConfig = {
      title: "View Employees by Manager",
      questions: [
        { type: "input", name: "managerId", message: "Enter the Manager ID:" },
      ],
    };

    try {
      const { managerId } = await this.getUserData(promptConfig);
      return await this.dbAccess.getEmployeeByManager(managerId);
    } catch (error) {
      return this.handleError(error, "The Manager ID should be an integer");
    }
  }

  async viewEmployeesByDepartment() {
    const promptConfig = {
      title: "View Employees by Department",
      questions: [
        {
          type: "input",
          name: "departmentId",
          message: "Enter the Department ID:",
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
    const promptConfig = {
      title: "Total Utilized Budget",
      questions: [
        {
          type: "input",
          name: "departmentId",
          message: "Enter the Department ID:",
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
