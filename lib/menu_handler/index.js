"use strict";

const inquirer = require("inquirer");
const ViewHandler = require("./view_handler");
const AddHandler = require("./add_handler");
const UpdateHandler = require("./update_handler");
const DeleteHandler = require("./delete_handler");

class MenuHandler {
  constructor(dbAccess) {
    this.dbAccess = dbAccess;
    this.viewHandler = new ViewHandler(dbAccess);
    this.addHandler = new AddHandler(dbAccess);
    this.updateHandler = new UpdateHandler(dbAccess);
    this.deleteHandler = new DeleteHandler(dbAccess);
  }

  async handle(mainMenu, subMenu) {
    const handlers = {
      View: this.viewHandler.handleView.bind(this.viewHandler),
      Add: this.addHandler.handleAdd.bind(this.addHandler),
      Update: this.updateHandler.handleUpdate.bind(this.updateHandler),
      Delete: this.deleteHandler.handleDelete.bind(this.deleteHandler),
      Exit: () => {
        console.log("Goodbye!");
        process.exit();
      },
    };

    const handler = handlers[mainMenu];
    if (handler) {
      await handler(subMenu);
    } else {
      console.log("Invalid choice");
      return;
    }
  }
}

module.exports = MenuHandler;
