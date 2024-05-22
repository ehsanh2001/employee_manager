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

async function pressAnyKey() {
  await inquirer.prompt([
    {
      type: "input",
      name: "continue",
      message: "(Press any key to continue)",
      filter: () => true,
    },
  ]);
}

module.exports = { UserInput, pressAnyKey };
