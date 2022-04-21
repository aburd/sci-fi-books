// Code dealing with getting our books from a data source
// 
const promisify = require('util').promisify;

/**
 * @typedef {import('./book').Book} Book
 */

/**
 * Get our books from the DB
 * @param {sqlite3DB} db
 * @return {Book[]}
 */
async function getScifiBooks(db) {
  const all = promisify(db.all.bind(db));
  return await all(`
    SELECT title, full_title as fullTitle, publish_date as publishDate, isbn13, isbn10 
    FROM books
  `);
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
 * @param {sqlite3DB} db
 * @param {Book} book
 * @return {void} 
 */
async function addScifiBook(db, book) {
  if (!book) return;
  const get = promisify(db.get.bind(db));

  let authorRow;
  if (book.author) {
    authorRow = await get(`
      INSERT INTO authors 
        (name, bio)
      VALUES ($name, $bio)
      RETURNING id
    `, { $name: book.author.name, $bio: book.author.bio});
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
 * @param {sqlite3DB} db
 * @param {string} isbn
 * @return {Promise<void>} 
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

module.exports = {
  getScifiBooks,
  getScifiBook,
  addScifiBook,
  deleteScifiBook,
};
