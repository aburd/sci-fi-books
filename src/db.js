// Load in the file-system module from the node standard-library
// Whenever anybody talks about a "standard library", they're just talking'
// about a library of code that the creators of the language give you
// to make the code more useful
// https://nodejs.org/dist/latest-v16.x/docs/api/fs.html
const fs = require('fs');

/**
 * A function that gets our books, could connect to a DB in the future
 * For now, just reads a JSON file
 * @return {Book[]}
 */
exports.getScifiBooks = function () {
  const dbPath = `${__dirname}/fake-db.json`;
  const books = fs.readFileSync(dbPath, { encoding: 'utf8' });
  return JSON.parse(books);
}

