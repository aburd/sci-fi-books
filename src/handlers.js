const cliSelect = require("cli-select");
const { createSpinner } = require('nanospinner');
const { getScifiBooks, getScifiBook, addScifiBook, deleteScifiBook } = require("./db");
const { displayBook, openLibraryToBook } = require("./book");
const openLibApi = require("./services/openLibrary");
const { isIsbnValid, emphasize, cardFromString, askQuestion, confirm } = require('./util');

function menuOptionsFromBooks(books) {
  return books.reduce((acc, b) => {
    acc[b.isbn13] = b.title;
    return acc;
  }, {});
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
  const openLibBook = await openLibApi.getBook(isbn).catch(() => spinner.error());

  if (!openLibBook.authors) {
    console.log('No authors. Rejecting ISBN.');
    return null;
  }
  const authorKey = openLibBook.authors[0].key;
  const openLibAuthor = await openLibApi.getAuthor(authorKey).catch(() => spinner.error());
  const book =  openLibraryToBook(openLibBook, openLibAuthor);
  spinner.success();
  return book;
}

/**
 * Displays the books, for now we will just print the books
 * to the terminal
 * @returns {void}
 */
async function handleShow() {
  const books = await getScifiBooks();
  if (!books.length) {
    console.log("No books in DB!");
    return;
  }
  const menuOptions = menuOptionsFromBooks(books);
  const { id, value } = await cliSelect({ values: menuOptions });
  const book = await getScifiBook(id);
  const halfTermWidth = Math.floor(process.stdout.columns * 0.45);
  const showText = cardFromString(displayBook(book, 'long'), halfTermWidth); 
  console.log(showText);
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

async function handleDelete() {
  const books = await getScifiBooks();
  const menuOptions = menuOptionsFromBooks(books);
  const cliOptions = {
    values: menuOptions,
  };
  const { value, id } = await cliSelect(cliOptions);

  if (await confirm(`Are you sure you want to delete ${value}?`)) {
    deleteScifiBook(id);
    console.log(`${value} has been deleted.`);
    return;
  }
  console.log(`Book will be kept in DB.`);
}

function handleQuit() {
  console.log("See ya around, space cowboy...");
  // Exit node process with exit code 0 ('success');
  // https://shapeshed.com/unix-exit-codes/
  process.exit(0);
}

module.exports = {
  fetchBook,
  handleShow,
  handleAdd,
  handleDelete,
  handleQuit,
}
