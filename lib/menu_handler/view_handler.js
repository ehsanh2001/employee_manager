"use strict";

const UserInput = require("../user_input");
const inquirer = require("inquirer");
const { table, getBorderCharacters } = require("table");
const Handler = require("./handler");

class ViewHandler extends Handler {
  constructor(dbAccess) {
    super(dbAccess);
    this.viewActions = {
      "View All Employees": async () => this.dbAccess.getAllEmployees(),
      "View All Roles": async () => this.dbAccess.getAllRoles(),
      "View All Departments": async () => this.dbAccess.getAllDepartments(),
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
        this.#displayTable(result);
        await UserInput.pressAnyKey();
      }
    } catch (error) {
      throw new Error("Error getting data from Database:\n " + error);
    }
  }

  // Get the list of managers from the database
  // Create a list of manager names for inquirer
  async getManagerChoices() {
    try {
      let managers = await this.dbAccess.getManagers();
      managers = managers.map((manager) => {
        return { name: manager.manager_name, value: manager.id };
      });
      managers.unshift({ name: "No Manager", value: null });
      return managers;
    } catch (error) {
      throw new Error(
        "Error getting list of managers from databse\n: " + error
      );
    }
  }

  async viewEmployeeByManager() {
    const managersChoices = await this.getManagerChoices();
    const promptConfig = {
      title: "Employees  by  Manager",
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
      const { managerId } = await this.getUserInput(promptConfig);
      return await this.dbAccess.getEmployeeByManager(managerId);
    } catch (error) {
      throw new Error(
        "Error getting list of employees by manager from Database:\n " + error
      );
    }
  }

  async viewEmployeesByDepartment() {
    const departmentChoices = await this.getDepartmentChoices();
    const promptConfig = {
      title: "Employees  by  Department",
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
      const { departmentId } = await this.getUserInput(promptConfig);
      return await this.dbAccess.getEmployeeByDepartment(departmentId);
    } catch (error) {
      throw new Error(
        "Error getting list of employees by department from Database:\n " +
          error
      );
    }
  }

  async viewTotalUtilizedBudget() {
    const departmentChoices = await this.getDepartmentChoices();
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
      const { departmentId } = await this.getUserInput(promptConfig);
      return await this.dbAccess.getTotalUtilizedBudget(departmentId);
    } catch (error) {
      throw new Error(
        "Error getting total utilized budget from Database:\n " + error
      );
    }
  }

  #displayTable(data) {
    if (!data || data.length === 0) {
      data = [{ message: "No records found" }];
    }
    const columnNames = Object.keys(data[0]).map((name) =>
      name.toUpperCase().replace("_", " ")
    );
    const tableData = [columnNames, ...data.map((row) => Object.values(row))];

    const config = {
      border: getBorderCharacters("norc"),
      drawHorizontalLine: (index, size) => {
        return index <= 1 || index === data.length + 1; // Only draw a horizontal line after the header
      },
    };

    console.log(table(tableData, config));
  }
}

module.exports = ViewHandler;
