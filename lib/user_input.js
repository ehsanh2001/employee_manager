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
    } catch (err) {
      err = new Error(`Error getting user input:\n ${err.message}`);
      throw err;
    }
  }
}

async function pressAnyKey() {
  try {
    await inquirer.prompt([
      {
        type: "input",
        name: "continue",
        message: "(Press any key to continue)",
        filter: () => true,
      },
    ]);
  } catch (err) {
    err = new Error(`Error getting user input:\n ${err.message}`);
    throw err;
  }
}

module.exports = { UserInput, pressAnyKey };
