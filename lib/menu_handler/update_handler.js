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
        "Update Employee Role": async () => this.updateEmployeeRole(),
        "Update Employee Manager": async () => this.updateEmployeeManager(), // Placeholder for the method
      };

      if (updateActions[subMenu]) {
        await updateActions[subMenu]();
      }
    } catch (error) {
      console.error("Error in function update: " + error);
      throw error;
    }
  }

  async getRoleChoices() {
    return this.getChoices("role", (role) => ({
      name: role.title,
      value: role.id,
    }));
  }

  async getChoices(table, mapFunction) {
    try {
      const items = await this.dbAccess.getAll(table);
      return items.map(mapFunction);
    } catch (error) {
      console.log(`Error getting ${table} list`);
      await UserInput.pressAnyKey();
      throw error;
    }
  }

  async updateEmployeeRole() {
    try {
      const roleChoices = await this.getRoleChoices();

      const promptConfig = {
        title: "Update Employee Role",
        questions: [
          {
            type: "input",
            name: "employeeId",
            message: "Enter the Employee ID:",
          },
          {
            type: "list",
            name: "roleId",
            message: "Enter the Role ID:",
            choices: roleChoices,
          },
        ],
      };

      const answers = await this.getUserData(promptConfig);
      await this.dbAccess.updateEmployeeRole(answers);
      console.log("\n\n\tEmployee Role updated successfully\n\n");
    } catch (error) {
      this.handleAddError(error);
    } finally {
      await UserInput.pressAnyKey();
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

  handleAddError(error) {
    if (error.message.includes("violates foreign key constraint")) {
      console.log("Foreign key constraint violated. Please check your inputs.");
    } else if (error.message.includes("violates not-null constraint")) {
      console.log("Required fields are missing.");
    } else {
      console.log(error.message);
    }
  }
}

module.exports = UpdateHandler;
