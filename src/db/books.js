// Code dealing with getting our books from a data source
// 
const promisify = require('util').promisify;

/**
 * @typedef {import('./book').Book} Book
 */

// Load in the file-system module from the node standard-library
// Whenever anybody talks about a "standard library", they're just talking'
// about a library of code that the creators of the language give you
// to make the code more useful
// https://nodejs.org/dist/latest-v16.x/docs/api/fs.html
const fs = require("fs/promises");

/**
 * A function that gets our books, could connect to a DB in the future
 * For now, just reads a JSON file
 * @return {Book[]}
 */
async function getScifiBooks() {
  const get = promisify(db.get.bind(db));
  return await get(`
    SELECT title, full_title as fullTitle, publish_date as publishDate, isbn13, isbn10 
    FROM books
  `, {$isbn10: isbn, $isbn13: isbn});
}

/**
 * Get book from db by some ISBN
 * @param {sqlite3DB} db
 * @param {string} isbn
 * @return {Book || null}
 */
async function getScifiBook(db, isbn) {
  const get = promisify(db.get.bind(db));
  const row = await get(`
    SELECT title, full_title as fullTitle, publish_date as publishDate, isbn13, isbn10 
    FROM books
    WHERE 
      isbn10 = $isbn10 OR
      isbn13 = $isbn13
  `, {$isbn10: isbn, $isbn13: isbn});
  return row;
}

/**
 * A function that adds a book to our DB
 * For now, just adds book to the JSON file
 * @param {Book} book
 * @return {void} 
 */
async function addScifiBook(db, book) {
  if (!book) return;
  const get = promisify(db.get.bind(db));

  let authorRow;
  if (book.author) {
    authorRow = await get(`
      INSERT INTO (name, bio)
      VALUES ($name, $bio)
      RETURNING id
    `, {name: book.author.name, bio: book.author.bio}, res);
  }
  const row = await get(`
    INSERT INTO books
    (title, full_title, publish_date, isbn13, isbn10, author_id)
    VALUES ($title, $fullTitle, $publishDate, $isbn13, $isbn10, $authorId) 
    RETURNING id, isbn13
  `, {
    $title: book.title,
    $fullTitle: book.fullTitle,
    $publishDate: book.publishDate,
    $isbn13: book.isbn13,
    $isbn10: book.isbn10,
    $authorId: authorRow?.id
  });
  return row;
}

/**
 * A function that deletes a book from our DB
 * @param {string} isbn
 * @return {void} 
 */
async function deleteScifiBook(db, isbn) {
  if (!isbn) return;
  const run = promisify(db.run.bind(db));
  await run(`
    DELETE FROM books
    WHERE 
      isbn13 = ? OR
      isbn10 = ?
  `, isbn, isbn);
}

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
