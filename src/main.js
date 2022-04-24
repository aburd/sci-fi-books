const path = require('path');
const cliSelect = require("cli-select");
const { open } = require('lmdb');
const { initBooksDb } = require('../src/db/books');
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
async function handleUserMenuSelect(userSelection, booksDb) {
  switch (userSelection) {
    case "search": {
      await handlers.handleSearch(booksDb);
      break;
    }
    case "show": {
      await handlers.handleShow(booksDb);
      break;
    }
    case "delete": {
      await handlers.handleDelete(booksDb);
      break;
    }
    case "add": {
      await handlers.handleAdd(booksDb);
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
  runOptionsMenu(booksDb);
}

async function runOptionsMenu(booksDb) {
  const { value, id } = await cliSelect(cliOptions);
  console.log(`>> ${value}`);
  await handleUserMenuSelect(id, booksDb);
}

function main() {
  const dbPath = path.join(__dirname, '..', 'scifibooks');
  const db = open({
    path: dbPath,
    // any options go here, we can turn on compression like this:
    compression: true,
  });
  const booksDb = initBooksDb(db);
  runOptionsMenu(booksDb);
}

main();
