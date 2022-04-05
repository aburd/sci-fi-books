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
exports.getScifiBooks = async function () {
  const books = await fs.readFile(DB_PATH, { encoding: "utf8" });
  return JSON.parse(books);
};

/**
 * A function that adds a book to our DB
 * For now, just adds book to the JSON file
 * @return {Book[]}
 */
exports.addScifiBook = async function (book) {
  const fileContent = await fs.readFile(DB_PATH, { encoding: "utf8" });
  const books = JSON.parse(fileContent);
  books.push(book);
  await fs.writeFile(DB_PATH, JSON.stringify(books), { encoding: 'utf8' });
};
