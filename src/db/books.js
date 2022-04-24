// Code dealing with getting our books from a data source
// 

/**
 * @typedef {import('./book').Book} Book
 */

module.exports = {
  initBooksDb: (db) => ({
    /**
     * Returns the books in the db 
     * @param {number} offset
     * @param {number} limit
     * @return {Book[]}
     */
    getScifiBooks(offset = 0, limit = 10) {
      const values = db.getRange({ limit, offset })
        .map(({ value }) => value);
      return [...values];
    },

    /**
     * Get book from db by some ISBN
     * @param {string} isbn
     * @return {Book || null}
     */
    getScifiBook(isbn) {
      return db.get(isbn);
    },

    /**
     * A function that adds a book to our DB
     * For now, just adds book to the JSON file
     * @param {Book} book
     * @return {void} 
     */
    async addScifiBook(book) {
      return await db.put(book.isbn13 || book.isbn10, book);
    },

    /**
     * A function that deletes a book from our DB
     * @param {string} isbn
     * @return {void} 
     */
    async deleteScifiBook(isbn) {
      return await db.remove(isbn);
    },

    /**
     * DANGEROUS: Empties all the data from the DB
     * @return {Promise<void>} 
     */
    resetDb() {
      return db.clearAsync();
    }
  }),
};

