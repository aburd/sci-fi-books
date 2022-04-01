const { getScifiBooks } = require('./db');
// Dependency installed via `npm i cli-select`
// https://www.npmjs.com/package/cli-select
const cliSelect = require('cli-select');
// Dependency installed via `npm i node-fetch`
const fetch = require('node-fetch');

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
 * A function that gets book information from user inputted ISBN via API
 * 
 */
 function regByISBN() {

  const readline = require("readline");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter book ISBN: ", function(isbn) {
    console.log('\n');
    console.log(`Registering ISBN: ${isbn}...`);
    rl.close();

    const openLibraryURL = 'https://openlibrary.org';
    const bookEndPoint = '/isbn/';
    const apiSuffix = '.json';
    // const sampleISBN = '9780316212366'

    let bookURL = openLibraryURL + bookEndPoint + isbn + apiSuffix;
    console.log(bookURL);
    
      fetch(bookURL)
        .then(res => res.json()) // .then OR could be async+await
        .then(book => {

          const authorEndPointWithID = book.authors[0].key;
          const bookTitle = book.title;
          let authorURL = openLibraryURL + authorEndPointWithID + apiSuffix;

          return fetch(authorURL)
          .then(res => res.json())
          .then(author => {
            const authorName = author.name;

            console.log('\n');
            console.log('Title:', bookTitle);
            console.log('Author:', authorName);
            console.log('***Your book has not been added to the database, but will in the future \n')
              
            })  
        })
  });
}

/**
 * Handles the selected CLI option
 * @param {string} id - 'show'|'delete'|'add'|'quit'
 * @param {string} value - e.g. 'Show a Book'
 * @returns {void}
 */
 async function handleSelection({ id, value }) {
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
      await regByISBN()
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
