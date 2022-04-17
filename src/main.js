const cliSelect = require("cli-select");
const db = require('./db');
const handlers = require("./handlers");

const MENU_OPTIONS = {
  search: "Search for a book",
  show: "Show books",
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
    case "search": {
      await handlers.handleSearch();
      break;
    }
    case "show": {
      await handlers.handleShow();
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
      break;
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

async function main() {
  try {
    await db.init();
    await runOptionsMenu();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
