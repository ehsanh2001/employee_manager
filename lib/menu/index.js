// module to handle the cascading prompts(menu) using inquirer

const inquirer = require("inquirer");
const logoWriter = require("../logo_writer");
const menuItems = require("./menu_items.json");
const fs = require("fs/promises");

// Defines and displays a menu with the menuText written in ascii-art
// and the menuChoices as the choices
class Menu {
  constructor(menuChoices, menuText) {
    this.menuText = menuText;
    this.menu = [
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: menuChoices,
      },
    ];
  }

  async prompt() {
    try {
      // Clear the console and display the menu text
      console.clear();
      await logoWriter.writeText(`${this.menuText}`);
      // Prompt for the menu choice
      const answer = await inquirer.prompt(this.menu);

      return answer["choice"];
    } catch (error) {
      console.error("Error in function displaySubMenu");
      throw error;
    }
  }
}

class CascadingMenu {
  //menuItems is an array of objects with the structure of menu_items.json
  //menuText is the text to display at the top of the menu with ascii-art
  constructor(menuItems, menuText) {
    let mainChoices = menuItems.map((item) => item.name);
    this.mainMenu = new Menu(mainChoices, menuText);

    this.subMenus = {};
    for (let item of menuItems) {
      if (item.subMenu.length > 0) {
        this.subMenus[item.name] = new Menu(item.subMenu, item.name);
      }
    }
  }

  // Display the main menu and submenus
  // returns the main menu and submenu choices: {mainMenu, subMenu}
  async prompt() {
    try {
      // First, prompt for the main menu
      const mainAnswer = await this.mainMenu.prompt();
      // Based on the main menu selection, prompt for the corresponding submenu
      const subMenu = this.subMenus[mainAnswer];
      // If there is no submenu, return the main menu choice
      if (!subMenu) return { mainMenu: mainAnswer, subMenu: "" };

      const subAnswer = await subMenu.prompt();
      return { mainMenu: mainAnswer, subMenu: subAnswer };
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

module.exports = {
  Menu,
  CascadingMenu,
};
