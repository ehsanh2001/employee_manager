"use strict";

const UserInput = require("../user_input");
const inquirer = require("inquirer");

class AddHandler {
  constructor(dbAccess) {
    this.dbAccess = dbAccess;
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
    } catch (error) {
      console.error("Error in function add: " + error);
      throw error;
    }
  }

  async getRoleChoices() {
    return this.getChoices("role", (role) => ({
      name: role.title,
      value: role.id,
    }));
  }

  async getManagerChoices() {
    const choices = await this.getChoices("employee", (manager) => ({
      name: `${manager.first_name} ${manager.last_name}`,
      value: manager.id,
    }));
    choices.unshift({ name: "None", value: null });
    return choices;
  }

  async getDepartmentChoices() {
    return this.getChoices("department", (department) => ({
      name: department.name,
      value: department.id,
    }));
  }

  async getChoices(table, mapFunction) {
    try {
      let items;
      if (table === "role") {
        items = await this.dbAccess.getAllRoles();
      } else if (table === "department") {
        items = await this.dbAccess.getAllDepartments();
      } else if (table === "employee") {
        items = await this.dbAccess.getAllEmployees();
      }
      return items.map(mapFunction);
    } catch (error) {
      console.log(`Error getting ${table} list`);
      await UserInput.pressAnyKey();
      throw error;
    }
  }

  async addEmployee() {
    try {
      const roleChoices = await this.getRoleChoices();
      const managerChoices = await this.getManagerChoices();

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

      const answers = await this.getUserData(promptConfig);
      await this.dbAccess.addEmployee(answers);
      console.log("\n\n\tEmployee added successfully\n\n");
    } catch (error) {
      this.handleAddError(error);
    } finally {
      await UserInput.pressAnyKey();
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

      const answers = await this.getUserData(promptConfig);
      await this.dbAccess.addRole(answers);
      console.log("\n\n\tRole added successfully\n\n");
    } catch (error) {
      this.handleAddError(error);
    } finally {
      await UserInput.pressAnyKey();
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
      const answers = await this.getUserData(promptConfig);
      await this.dbAccess.addDepartment(answers);
      console.log("\n\n\tDepartment added successfully\n\n");
    } catch (error) {
      console.log(error.message);
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

module.exports = AddHandler;
