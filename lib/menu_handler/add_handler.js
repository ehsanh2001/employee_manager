"use strict";

const UserInput = require("../user_input");
const Handler = require("./handler");

class AddHandler extends Handler {
  constructor(dbAccess) {
    super(dbAccess);
  }

  async handleAdd(subMenu) {
    try {
      const addActions = {
        "Add Employee": async () => this.addEmployee(),
        "Add Role": async () => this.addRole(),
        "Add Department": async () => this.addDepartment(),
      };

      if (addActions[subMenu]) {
        await addActions[subMenu]();
      }
    } catch (err) {
      console.log("Error Adding to Database:\n " + err.message);
      await UserInput.pressAnyKey();
      return;
    }
  }

  async addEmployee() {
    try {
      const roleChoices = await this.getRoleChoices();
      // managers are employees, so we get the list of employees
      const managerChoices = await this.getEmployeeChoices();
      managerChoices.unshift({ name: "None", value: null });

      const promptConfig = {
        title: "Add Employee",
        questions: [
          {
            type: "input",
            name: "firstName",
            message: "Enter the First Name:",
          },
          { type: "input", name: "lastName", message: "Enter the Last Name:" },
          {
            type: "list",
            name: "roleId",
            message: "Choose the Role:",
            choices: roleChoices,
          },
          {
            type: "list",
            name: "managerId",
            message: "Choose the Manager:",
            choices: managerChoices,
            pageSize: 10,
          },
        ],
      };

      const answers = await this.getUserInput(promptConfig);
      await this.dbAccess.addEmployee(answers);
      console.log("\n\n\tEmployee added successfully\n\n");
      await UserInput.pressAnyKey();
    } catch (error) {
      const addErr = this.handleAddError(error);
      throw new Error("Error Adding Employee:\n " + addErr.message);
    }
  }

  async addRole() {
    try {
      const departmentChoices = await this.getDepartmentChoices();

      const promptConfig = {
        title: "Add Role",
        questions: [
          { type: "input", name: "title", message: "Enter the Role Title:" },
          { type: "input", name: "salary", message: "Enter the Role Salary:" },
          {
            type: "list",
            name: "departmentId",
            message: "Choose the Department:",
            choices: departmentChoices,
          },
        ],
      };

      const answers = await this.getUserInput(promptConfig);
      await this.dbAccess.addRole(answers);
      console.log("\n\n\tRole added successfully\n\n");
      await UserInput.pressAnyKey();
    } catch (error) {
      const addErr = this.handleAddError(error);
      throw new Error("Error Adding Role:\n " + addErr.message);
    }
  }

  async addDepartment() {
    const promptConfig = {
      title: "Add Department",
      questions: [
        { type: "input", name: "name", message: "Enter the Department Name:" },
      ],
    };

    try {
      const answers = await this.getUserInput(promptConfig);
      await this.dbAccess.addDepartment(answers);
      console.log("\n\n\tDepartment added successfully\n\n");
      await UserInput.pressAnyKey();
    } catch (err) {
      const addErr = this.handleAddError(err);
      throw new Error("Error Adding Department:\n " + addErr.message);
    }
  }

  // Error handling for add operations
  // This function is called when an error occurs during an add operation
  handleAddError(error) {
    if (error.message.includes("violates foreign key constraint")) {
      return new Error(
        "Foreign key constraint violated. Please check your inputs.\n" +
          error.message
      );
    } else if (error.message.includes("violates not-null constraint")) {
      return new Error("Required fields are missing.\n " + error.message);
    } else {
      return error;
    }
  }
}

module.exports = AddHandler;
