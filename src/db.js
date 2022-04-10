// Code dealing with getting our books from a data source
// 

/**
 * @typedef {import('./book').Book} Book
 */

// Load in the file-system module from the node standard-library
// Whenever anybody talks about a "standard library", they're just talking'
// about a library of code that the creators of the language give you
// to make the code more useful
// https://nodejs.org/dist/latest-v16.x/docs/api/fs.html
const fs = require("fs/promises");

const DB_PATH = `${__dirname}/fake-db.json`;

/**
 * A function that gets our books, could connect to a DB in the future
 * For now, just reads a JSON file
 * @return {Book[]}
 */
async function getScifiBooks() {
  const books = await fs.readFile(DB_PATH, { encoding: "utf8" });
  return JSON.parse(books);
};

/**
 * Get book from db by some ISBN
 * @param {string} isbn
 * @return {Book || null}
 */
async function getScifiBook(isbn) {
  const books = await getScifiBooks();
  for (const book of books) {
    if (book.isbn10 == isbn || book.isbn13 == isbn) {
      return book;
    }
  }
  return null;
};

/**
 * A function that adds a book to our DB
 * For now, just adds book to the JSON file
 * @param {Book} book
 * @return {void} 
 */
async function addScifiBook(book) {
  if (!book) return;
  const fileContent = await fs.readFile(DB_PATH, { encoding: "utf8" });
  const books = JSON.parse(fileContent);
  books.push(book);
  await fs.writeFile(DB_PATH, JSON.stringify(books, null, 2), { encoding: 'utf8' });
};

/**
 * A function that deletes a book from our DB
 * @param {string} isbn
 * @return {void} 
 */
async function deleteScifiBook(isbn13) {
  if (!isbn13) return;
  const fileContent = await fs.readFile(DB_PATH, { encoding: "utf8" });
  let books = JSON.parse(fileContent);
  books = books.filter(b => b.isbn13 != isbn13);
  await fs.writeFile(DB_PATH, JSON.stringify(books, null, 2), { encoding: 'utf8' });
};

/**
 * DANGEROUS: Empties all the data from the DB
 */
async function resetDb() {
  await fs.writeFile(DB_PATH, "[]");
}

module.exports = {
  resetDb,
  getScifiBooks,
  getScifiBook,
  addScifiBook,
  deleteScifiBook,
};
