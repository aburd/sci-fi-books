const { getScifiBooks, getScifiBook, addScifiBook } = require("./db");
const cliSelect = require("cli-select");
// Dependency installed via `npm i node-fetch`
const readline = require("readline");
const { displayBook, openLibraryToBook } = require("./book");
const openLibApi = require("./services/openLibrary");

const MENU_OPTIONS = {
  show: "Show books",
  add: "Add a Book",
  delete: "Delete a Book",
  quit: "Quit",
};
const cliOptions = {
  values: MENU_OPTIONS,
};

/**
 * Ask user for something, and wait for the answer
 * @param {string} question
 * @return {string} answer
 */
async function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const answer = await new Promise((answer) => {
    rl.question(question, answer);
  });
  rl.close();
  return answer;
}

/**
 * Confirm a question, recurse on invalid input
 * @returns {boolean}
 */
async function confirm(question) {
  const res = await askQuestion(`${question}\nAnswer y/n\n`);
  if (res === 'y') {
    return true;
  }
  if (res === 'n') {
    return false;
  }
  console.log('Not a valid answer.');
  return confirm(question);
}

/**
 * A function that uses isbn to fetch and print book details
 *
 */
async function fetchBook(isbn) {
  //const sampleISBN = '9780316212366'
  console.log(`\nRegistering ISBN: ${isbn}`);

  const openLibBook = await openLibApi.getBook(isbn);
  if (!openLibBook.authors) {
    console.log('No authors. Rejecting ISBN.');
    return null;
  }
  const authorKey = openLibBook.authors[0].key;
  const openLibAuthor = await openLibApi.getAuthor(authorKey);
  return openLibraryToBook(openLibBook, openLibAuthor);
}

/**
 * Displays the books, for now we will just print the books
 * to the terminal
 * @returns {void}
 */
async function handleShow() {
  const books = await getScifiBooks();
  for (const book of books) {
    console.log(displayBook(book));
  }
}

function emphasize(s) {
  const lines = s.split('\n').map(s => s.length);
  const longestLen = Math.max(...lines);
  const stars = "*".repeat(longestLen);
  return `\n${stars}\n${s}\n${stars}\n`;
}

/**
 * A function that gets ISBN from user input
 * @return {Promise<void>}
 */
async function handleAdd() {
  const isbn = await askQuestion("Enter ISBN: ");
  const dbBook = await getScifiBook(isbn);
  if (dbBook) {
    console.log(emphasize("This book is already registered"));
    console.log(displayBook(dbBook));
    return;
  }

  const book = await fetchBook(isbn);
  console.log('Book found!');
  console.log(emphasize(displayBook(book)));

  if (await confirm('Add to DB?')) {
    addScifiBook(book);
    console.log(`\n${book.title} has been added to the database.`);
  } else {
    console.log(`\n${book.title} will not be added to the database.`)
  }
}

function handleDelete() {
  console.log("Not supported!");
}

function handleQuit() {
  console.log("See ya around, space cowboy...");
  // Exit node process with exit code 0 ('success');
  // https://shapeshed.com/unix-exit-codes/
  process.exit(0);
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
      await handleShow();
      break;
    }
    case "delete": {
      handleDelete();
      break;
    }
    case "add": {
      await handleAdd();
      break;
    }
    case "quit": {
      handleQuit();
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
