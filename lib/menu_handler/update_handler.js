"use strict";

const UserInput = require("../user_input");
const inquirer = require("inquirer");

class UpdateHandler {
  constructor(dbAccess) {
    this.dbAccess = dbAccess;
  }

  async handleUpdate(subMenu) {
    try {
      const updateActions = {
        "Update Employee Role": async () => this.#updateEmployeeRole(),
        "Update Employee Manager": async () => this.#updateEmployeeManager(), // Placeholder for the method
      };

      if (updateActions[subMenu]) {
        await updateActions[subMenu]();
      }
    } catch (error) {
      console.error("Error in function update: " + error);
      throw error;
    }
  }

  async #getEmployeeChoices() {
    return this.#getChoices("employee", (employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
  }

  async #getRoleChoices() {
    return this.#getChoices("role", (role) => ({
      name: role.title,
      value: role.id,
    }));
  }

  async #getChoices(table, mapFunction) {
    try {
      const items = await this.dbAccess.getAll(table);
      return items.map(mapFunction);
    } catch (error) {
      console.log(`Error getting ${table} list`);
      await UserInput.pressAnyKey();
      throw error;
    }
  }

  async #updateEmployeeRole() {
    try {
      const employeeChoices = await this.#getEmployeeChoices();
      const roleChoices = await this.#getRoleChoices();

      const promptConfig = {
        title: "Update Employee Role",
        questions: [
          {
            type: "list",
            name: "employeeId",
            message: "Choose the Employee:",
            choices: employeeChoices,
          },
          {
            type: "list",
            name: "roleId",
            message: "Choose the New Role:",
            choices: roleChoices,
          },
        ],
      };

      const answers = await this.#getUserInput(promptConfig);
      await this.dbAccess.updateEmployeeRole(answers);
      console.log("\n\n\tEmployee Role updated successfully\n\n");
    } catch (error) {
      console.log(error.message);
    } finally {
      await UserInput.pressAnyKey();
    }
  }

  async #updateEmployeeManager() {
    try {
      const employeeChoices = await this.#getEmployeeChoices();
      // Get the list of managers (managers are employees too)
      const managerChoices = await this.#getEmployeeChoices();

      const promptConfig = {
        title: "Update Employee Manager",
        questions: [
          {
            type: "list",
            name: "employeeId",
            message: "Choose the Employee:",
            choices: employeeChoices,
          },
          {
            type: "list",
            name: "managerId",
            message: "Choose the New Manager:",
            choices: managerChoices,
          },
        ],
      };

      const answers = await this.#getUserInput(promptConfig);
      await this.dbAccess.updateEmployeeManager(answers);
      console.log("\n\n\tEmployee Manager updated successfully\n\n");
    } catch (error) {
      console.log(error.message);
    }
  }

  async #getUserInput(promptConfig) {
    const userInput = new UserInput.UserInput(
      promptConfig.title,
      promptConfig.questions
    );
    await userInput.getUserData();
    return userInput.answers;
  }
}

module.exports = UpdateHandler;
