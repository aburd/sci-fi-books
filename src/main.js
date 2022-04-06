const { getScifiBooks, getScifiBook } = require("./db");
const cliSelect = require("cli-select");
// Dependency installed via `npm i node-fetch`
const fetch = require("node-fetch");
const readline = require("readline");
const { displayBook, openLibraryToBook } = require("./book");

const MENU_OPTIONS = {
  show: "Show a book",
  add: "Add a Book",
  delete: "Delete a Book",
  quit: "Quit",
};
const cliOptions = {
  values: MENU_OPTIONS,
};

/**
 * Displays the books, for now we will just print the books
 * to the terminal
 * @returns {void}
 */
async function displayBooks() {
  const books = await getScifiBooks();
  for (const book of books) {
    displayBook(book);
  }
}

/**
 * A function that gets ISBN from user input
 * @return {void}
 */
async function regByISBN() {
  const isbn = await askForIsbn();
  const book = await getScifiBook(isbn);
  if (book) {
    console.log("This book is already registered");
    displayBook(book);
    return;
  }
  await printBookDetails(isbn);
}

/**
 * Ask user for the ISBN
 * @return {string} isbn
 */
async function askForIsbn() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const isbn = await new Promise((isbn) => {
    rl.question("Enter book ISBN: ", isbn);
  });
  rl.close();
  return isbn;
}

/**
 * A function that uses isbn to fetch and print book details
 *
 */
async function printBookDetails(isbn) {
  //const sampleISBN = '9780316212366'
  console.log(`\nRegistering ISBN: ${isbn}`);

  const openLibraryURL = "https://openlibrary.org";
  const bookEndPoint = "/isbn/";
  const apiSuffix = ".json";

  const bookURL = openLibraryURL + bookEndPoint + isbn + apiSuffix;
  const bookResponse = await fetch(bookURL);
  const openLibBook = await bookResponse.json();

  const authorEndPointWithID = openLibBook.authors[0].key;
  const authorURL = openLibraryURL + authorEndPointWithID + apiSuffix;
  const authorResponse = await fetch(authorURL);
  const openLibAuthor = await authorResponse.json();

  const book = openLibraryToBook(openLibBook, openLibAuthor);
  displayBook(book);

  console.log(
    "***Your book has not been added to the database, but will in the future \n \n \n"
  );
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
    case "show": {
      await displayBooks();
      break;
    }
    case "delete": {
      console.log("Not supported!");
      break;
    }
    case "add": {
      await regByISBN();
      break;
    }
    case "quit": {
      console.log("See ya around, space cowboy...");
      // Exit node process with exit code 0 ('success');
      // https://shapeshed.com/unix-exit-codes/
      process.exit(0);
    }
    default:
      console.log("Unrecognized option selected");
  }

  console.log("");
  // Run menu again, 'quit' is the only way to get out of loop
  runOptionsMenu();
}

// TODO: handle errors more gracefully
function handleError(e) {
  console.error(e);
  console.log("Something bad happened.");
}

function runOptionsMenu() {
  cliSelect(cliOptions).then(handleSelection).catch(handleError);
}

function main() {
  runOptionsMenu();
}

main();
