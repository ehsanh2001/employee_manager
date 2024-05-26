"use strict";

const UserInput = require("../user_input");

class Handler {
  constructor(dbAccess) {
    this.dbAccess = dbAccess;
  }

  async getEmployeeChoices() {
    return this.getChoices("employee", (employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
  }

  async getRoleChoices() {
    return this.getChoices("role", (role) => ({
      name: role.title,
      value: role.id,
    }));
  }

  async getDepartmentChoices() {
    return this.getChoices("department", (department) => ({
      name: department.name,
      value: department.id,
    }));
  }

  async getChoices(table, mapFunction) {
    try {
      let items = await this.dbAccess.getAll(table);
      return items.map(mapFunction);
    } catch (err) {
      throw new Error(`Error getting ${table} data:\n ${err.message}`);
    }
  }

  async getUserInput(promptConfig) {
    const userInput = new UserInput.UserInput(
      promptConfig.title,
      promptConfig.questions
    );
    await userInput.getUserData();
    return userInput.answers;
  }
}

module.exports = Handler;
