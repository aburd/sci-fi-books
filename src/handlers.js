const { createSpinner } = require('nanospinner');
const readline = require("readline");
const { getScifiBooks, getScifiBook, addScifiBook } = require("./db");
const { displayBook, openLibraryToBook } = require("./book");
const openLibApi = require("./services/openLibrary");
const { isIsbnValid, emphasize } = require('./util');


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
  console.log();

  const spinner = createSpinner(`Registering ISBN: ${isbn}`);
  spinner.start();
  const openLibBook = await openLibApi.getBook(isbn);
  if (openLibBook) {
    spinner.success();
  } else {
    spinner.error();
  }

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

/**
 * A function that gets ISBN from user input
 * @return {Promise<void>}
 */
async function handleAdd() {
  const isbn = await askQuestion("Enter ISBN: ");
  if (!isIsbnValid(isbn)) {
    console.log(`ISBN ("${isbn}") is not valid.`);
    return;
  }

  const dbBook = await getScifiBook(isbn);
  if (dbBook) {
    console.log(emphasize("This book is already registered"));
    console.log(displayBook(dbBook));
    return;
  }

  const book = await fetchBook(isbn);
  if (!book) {
    console.log(`Book with ISBN ("${isbn}") not found.`);
    return;
  }
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

module.exports = {
  handleShow,
  handleAdd,
  handleDelete,
  handleQuit,
}
