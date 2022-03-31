const { getScifiBooks } = require('./db');
// Dependency installed via `npm i cli-select`
// https://www.npmjs.com/package/cli-select
const cliSelect = require('cli-select');

const MENU_OPTIONS = {
  show: 'Show a book',
  add: 'Add a Book',
  delete: 'Delete a Book',
  quit: 'Quit',
};
const cliOptions = {
  values: MENU_OPTIONS,
};

/**
 * Displays the books, for now we will just print the books
 * to the terminal
 * @returns {void}
 */
function displayBooks() {
  const books = getScifiBooks();
  for (const book of books) {
    console.log(`- ${book.title}`);
  }
}

/**
 * Handles the selected CLI option
 * @param {string} id - 'show'|'delete'|'add'|'quit'
 * @param {string} value - e.g. 'Show a Book'
 * @returns {void}
 */
function handleSelection({ id, value }) {
  console.log(`>> ${value}`);
  switch (id) {
    case 'show': {
      displayBooks();
      break;
    }
    case 'delete': {
      console.log('Not supported!');
      break;
    }
    case 'add': {
      console.log('Not supported!');
      break;
    }
    case 'quit': {
      console.log('See ya around, space cowboy...');
      // Exit node process with exit code 0 ('success');
      // https://shapeshed.com/unix-exit-codes/
      process.exit(0);
    }
    default:
      console.log('Unrecognized option selected');
  }

  console.log('');
  // Run menu again, 'quit' is the only way to get out of loop
  runOptionsMenu();
}

// TODO: handle errors more gracefully
function handleError(e) {
  console.error(e);
  console.log('Something bad happened.');
}


function runOptionsMenu() {
  cliSelect(cliOptions)
    .then(handleSelection)
    .catch(handleError);
}

function main() {
  runOptionsMenu();
}

main();
