const cliSelect = require("cli-select");
const Db = require('./db');
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
 * @param {sqlite3DB} db
 * @param {string} userSelection - 'show'|'delete'|'add'|'quit'
 * @returns {void}
 */
async function handleUserMenuSelect(db, userSelection) {
  switch (userSelection) {
    case "search": {
      await handlers.handleSearch(db);
      break;
    }
    case "show": {
      await handlers.handleShow(db);
      break;
    }
    case "delete": {
      await handlers.handleDelete(db);
      break;
    }
    case "add": {
      await handlers.handleAdd(db);
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
  runOptionsMenu(db);
}

/**
 * Show the options in the CLI
 * @param {sqlite3DB} db
 */
async function runOptionsMenu(db) {
  const { value, id } = await cliSelect(cliOptions);
  console.log(`>> ${value}`);
  await handleUserMenuSelect(db, id);
}

async function main() {
  try {
    const db = await Db.init();
    await runOptionsMenu(db);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();
