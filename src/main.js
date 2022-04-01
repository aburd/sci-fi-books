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

/**
 * A function that gets book information from user inputted ISBN via API
 * 
 */
function regByISBN() {
  let isbn;
  const readline = require("readline");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter book ISBN: ", function(isbn) {
    console.log(`Registering ISBN: ${isbn}...`);
    console.log("Closing the interface");
    rl.close();
    const apiEndPoint = 'https://openlibrary.org/isbn/';
    const apiSuffix = '.json';
    // const sampleISBN = '9780316212366'
    let apiLookUp = apiEndPoint + isbn + apiSuffix;
    console.log('The operation is complete, please visit this URL for the data:',)
    console.log(apiLookUp); //api endpoint url properly interpolated with isbn for .json results
    // fetch(apiEndPoint)
    // .then(result => JSON.stringify(result))
    // .then(jsonBookObject => {
    // jsonBookData["title"]["author"]
    // })
  });
}

regByISBN();