const cliSelect = require("cli-select");
const handlers = require("./handlers");

const MENU_OPTIONS = {
  show: "Show books",
  search: "Search for a book",
  add: "Add a Book",
  delete: "Delete a Book",
  quit: "Quit",
};
const cliOptions = {
  values: MENU_OPTIONS,
};

/**
 * Handles the selected CLI option
 * @param {string} userSelection - 'show'|'delete'|'add'|'quit'
 * @returns {void}
 */
async function handleUserMenuSelect(userSelection) {
  switch (userSelection) {
    case "show": {
      await handlers.handleShow();
      break;
    }
    case "search": {
      await handlers.handleSearch();
      break;
    }
    case "delete": {
      await handlers.handleDelete();
      break;
    }
    case "add": {
      await handlers.handleAdd();
      break;
    }
    case "quit": {
      handlers.handleQuit();
    }
    default:
      console.log("Unrecognized option selected");
  }

  console.log("");
  // Run menu again, 'quit' is the only way to get out of loop
  runOptionsMenu();
}

async function runOptionsMenu() {
  const { value, id } = await cliSelect(cliOptions);
  console.log(`>> ${value}`);
  await handleUserMenuSelect(id);
}

runOptionsMenu();
