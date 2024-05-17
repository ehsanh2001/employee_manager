// module to handle the cascading prompts(menu) using inquirer

const inquirer = require("inquirer");
const logoWriter = require("./logoWriter");

// Define the main menu
const mainMenu = [
  {
    type: "list",
    name: "mainChoice",
    message: "What would you like to do?",
    choices: ["View", "Add", "Update", "Delete", "Exit"],
  },
];

// Define submenus for each main option
const subMenus = {
  View: [
    {
      type: "list",
      name: "subChoice",
      message: "What would you like to view:",
      choices: [
        "View All Employees",
        "View All Roles",
        "View All Departments",
        "View Employees by Manager",
        "View Employees by Department",
        "View Total Utilized Budget of a Department",
      ],
    },
  ],
  Add: [
    {
      type: "list",
      name: "subChoice",
      message: "What would You like to add:",
      choices: ["Add Employee", "Add Role", "Add Department"],
    },
  ],
  Update: [
    {
      type: "list",
      name: "subChoice",
      message: "What would you like to update:",
      choices: ["Update Employee Role", "Update Employee Manager"],
    },
  ],
  Delete: [
    {
      type: "list",
      name: "subChoice",
      message: "What would you like to delete:",
      choices: ["Delete Employee", "Delete Role", "Delete Department"],
    },
  ],
};

// returns menu value as a string
async function displayMainMenu() {
  try {
    // First, prompt for the main menu
    const mainAnswer = await inquirer.prompt(mainMenu);
    // Based on the main menu selection, prompt for the corresponding submenu
    return mainAnswer.mainChoice;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function displaySubMenu(subMenuName) {
  try {
    const subMenu = subMenus[subMenuName];
    if (subMenu) {
      console.clear();
      await logoWriter.writeText(`${subMenuName}`);

      const subAnswer = await inquirer.prompt(subMenu);
      return subAnswer.subChoice;
    } else {
      throw new Error(`Invalid submenu name: ${subMenuName}`);
    }
  } catch (error) {
    console.error("Error in function displaySubMenu");
    throw error;
  }
}

// Display the main menu and submenus
// returns the main menu and submenu choices: {mainMenu, subMenu}
async function userChoice() {
  while (true) {
    console.clear();
    try {
      await logoWriter.writeText("Employee Tracker");

      const mainMenu = await displayMainMenu();
      if (mainMenu === "Exit") return { mainMenu: mainMenu, subMenu: "" };

      const subMenu = await displaySubMenu(mainMenu);

      return { mainMenu: mainMenu, subMenu: subMenu };
    } catch (error) {
      console.error("Error in function userChoice");
      throw error;
    }
  }
}

module.exports = {
  userChoice,
};
