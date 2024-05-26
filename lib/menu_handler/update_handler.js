"use strict";

const UserInput = require("../user_input");
const Handler = require("./handler");

class UpdateHandler extends Handler {
  constructor(dbAccess) {
    super(dbAccess);
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
      throw new Error("Error Updating Database:\n " + error);
    }
  }

  async #updateEmployeeRole() {
    try {
      const employeeChoices = await this.getEmployeeChoices();
      const roleChoices = await this.getRoleChoices();

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

      const answers = await this.getUserInput(promptConfig);
      await this.dbAccess.updateEmployeeRole(answers);
      console.log("\n\n\tEmployee Role updated successfully\n\n");
      await UserInput.pressAnyKey();
    } catch (error) {
      throw new Error("Error updating employee role:\n " + error);
    }
  }

  async #updateEmployeeManager() {
    try {
      const employeeChoices = await this.getEmployeeChoices();
      // Get the list of managers (managers are employees too)
      const managerChoices = await this.getEmployeeChoices();
      managerChoices.unshift({ name: "None", value: null });

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

      const answers = await this.getUserInput(promptConfig);
      await this.dbAccess.updateEmployeeManager(answers);
      console.log("\n\n\tEmployee Manager updated successfully\n\n");
      await UserInput.pressAnyKey();
    } catch (error) {
      throw new Error("Error updating employee manager:\n " + error);
    }
  }
}

module.exports = UpdateHandler;
