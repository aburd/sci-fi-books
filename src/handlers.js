const cliSelect = require("cli-select");
const { createSpinner } = require('nanospinner');
const { getScifiBooks, getScifiBook, addScifiBook, deleteScifiBook } = require("./db");
const { displayBook, openLibraryToBook } = require("./book");
const openLibApi = require("./services/openLibrary");
const { isIsbnValid, emphasize, cardFromString, askQuestion, confirm } = require('./util');

function menuOptionsFromBooks(books) {
  return books.reduce((acc, b) => {
    acc[b.isbn13] = displayBook(b, 'short');
    return acc;
  }, {});
}

/**
 * A function that uses isbn to fetch and print book details
 *
 */
async function fetchBook(isbn) {
  const spinner = createSpinner(`Registering ISBN: ${isbn}`);
  spinner.start();
  const openLibBook = await openLibApi.getBook(isbn).catch(() => spinner.error());

  if (!openLibBook.authors) {
    spinner.error();
    console.log('No authors. Rejecting ISBN.');
    return null;
  }
  const authorKey = openLibBook.authors[0].key;
  const openLibAuthor = await openLibApi.getAuthor(authorKey).catch(() => spinner.error());
  const book = openLibraryToBook(openLibBook, openLibAuthor);
  spinner.success();
  return book;
}

function makeDocOptions(docs, hasPrevious = false, hasNext = false) {
  const initOptions = {};
  const halfTermWidth = getHalfTermWidth();
  const options = docs.reduce((acc, doc) => {
    if (!doc.isbn) return acc;
    const val = `${doc.title}, by ${doc.author_name.join(', ')}`;
    acc[doc.isbn[0]] = val.substring(0, halfTermWidth);
    return acc;
  }, initOptions);
  if (hasPrevious) {
    initOptions.previous = 'Previous';
  }
  if (hasNext) {
    options.next = 'Next';
  }
  return options;
}

function clearTerm() {
  process.stdout.write('\033c');
}

async function displaySearchPage(docs, page = 1, size = 10) {
  const start = (page - 1) * size;
  const end = page * size;
  const docOptions = makeDocOptions(docs.slice(start, end), Boolean(docs[start - 1]), Boolean(end));
  const { id, value } = await cliSelect({ values: docOptions });
  if (id === 'previous') {
    clearTerm();
    return await displaySearchPage(docs, page - 1, size);
  }
  if (id === 'next') {
    clearTerm();
    return await displaySearchPage(docs, page + 1, size);
  }
  return { isbn: id, title: value };
}

/**
 * Display docs from openApi search functionality
 * @param {SearchDoc[]} docs
 */
async function displayDocSearch(docs) {
  console.log(`Would you like to add one of these books?`);
  const { isbn, title } = await displaySearchPage(docs); 
  console.log("Registering ", title);
  const book = await fetchBook(isbn);
  addScifiBook(book);
}

/**
 * Search for an author by name and allow the user
 * to choose which of their books they'd like to download.
 */
async function handleSearchByAuthor() {
  const authorSearch = await askQuestion('Enter the author\'s name: ');
  const spinner = createSpinner(`Getting books by "${authorSearch}"`);
  spinner.start();
  const { numFound, docs } = await openLibApi.searchAuthor(authorSearch).catch(() => spinner.error());
  spinner.success();
  console.log(`Found ${numFound} results!`);
  if (docs.length) {
     await displayDocSearch(docs);
  }
}

function getHalfTermWidth() {
  return Math.floor(process.stdout.columns * 0.45);
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
  const halfTermWidth = getHalfTermWidth();
  const showText = cardFromString(displayBook(book, 'long'), halfTermWidth); 
  console.log(showText);
}

async function handleSearch() {
  const searchOptions = {
    author: "Search by author",
  };
  const { id, value } = await cliSelect({ values: searchOptions });
  console.log(`>> ${value}`);

  switch(id) {
    case "author":
      await handleSearchByAuthor();
      break;
    default:
      console.log('Unrecognized search option!');
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
  handleSearch,
  handleAdd,
  handleDelete,
  handleQuit,
}
