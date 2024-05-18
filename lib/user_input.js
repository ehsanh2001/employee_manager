"use strict";

const logoWriter = require("./logo_writer");
const inquirer = require("inquirer");

class UserInput {
  constructor(inputTitle, inputQuestions) {
    this.inputTitle = inputTitle;
    this.inputQuestions = inputQuestions;
    this.answers = null;
  }

  async getUserData() {
    console.clear();
    try {
      await logoWriter.writeText(this.inputTitle, "green");
      this.answers = await inquirer.prompt(this.inputQuestions);
      return this.answers;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserInput;
