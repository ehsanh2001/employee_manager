"use strict";

const UserInput = require("../user_input");
const Handler = require("./handler");

class DeleteHandler extends Handler {
  constructor(dbAccess) {
    super(dbAccess);
  }

  async handleDelete(subMenu) {
    try {
      const deleteActions = {
        "Delete Employee": async () => this.#deleteEmployee(),
        "Delete Role": async () => this.#deleteRole(),
        "Delete Department": async () => this.#deleteDepartment(),
      };

      if (deleteActions[subMenu]) {
        await deleteActions[subMenu]();
      }
    } catch (error) {
      throw new Error("Error Deleting from Database:\n " + error);
    }
  }

  async #deleteEmployee() {
    try {
      const employeeChoices = await this.getEmployeeChoices();

      const promptConfig = {
        title: "Delete Employee",
        questions: [
          {
            type: "list",
            name: "employeeId",
            message: "Select the employee to delete",
            choices: employeeChoices,
          },
        ],
      };

      const answers = await this.getUserInput(promptConfig);
      await this.dbAccess.deleteById("employee", answers.employeeId);

      console.log("\nEmployee deleted successfully\n");
    } catch (error) {
      error = new Error("Error deleting employee:\n " + error);
      throw error;
    } finally {
      await UserInput.pressAnyKey();
    }
  }

  async #deleteRole() {
    try {
      const roleChoices = await this.getRoleChoices();

      const promptConfig = {
        title: "Delete Role",
        questions: [
          {
            type: "list",
            name: "roleId",
            message: "Select the role to delete",
            choices: roleChoices,
          },
        ],
      };

      const answers = await this.getUserInput(promptConfig);
      await this.dbAccess.deleteById("role", answers.roleId);

      console.log("\nRole deleted successfully\n");
    } catch (error) {
      error = new Error("Error deleting role:\n " + error);
      throw error;
    } finally {
      await UserInput.pressAnyKey();
    }
  }

  async #deleteDepartment() {
    try {
      const departmentChoices = await this.getDepartmentChoices();

      const promptConfig = {
        title: "Delete Department",
        questions: [
          {
            type: "list",
            name: "departmentId",
            message: "Select the department to delete",
            choices: departmentChoices,
          },
        ],
      };

      const answers = await this.getUserInput(promptConfig);
      await this.dbAccess.deleteById("department", answers.departmentId);

      console.log("\nDepartment deleted successfully\n");
    } catch (error) {
      error = new Error("Error deleting department:\n " + error);
      throw error;
    } finally {
      await UserInput.pressAnyKey();
    }
  }
}

module.exports = DeleteHandler;
