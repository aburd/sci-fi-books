// Code dealing with how Books are defined
// and how they display themselves
//

/**
 * @typedef Book
 * @type {object}
 * @property {string} title
 * @property {string} fullTitle
 * @property {string[]} publishers
 * @property {string} publishDate
 * @property {string} isbn13
 * @property {string} isbn10
 * @property {Author} author
 */
/**
 * @typedef Author
 * @type {object}
 * @property {string} name
 * @property {string} birthDate
 * @property {string} bio
 */

/**
 * Displays a book to the terminal
 * @param {Book} book
 * @returns {void}
 */
exports.displayBook = function (book) {
  console.log("Title:", book.title);
  console.log("Authors:", book.author.name);
};

/**
 * Turns API responses into our Book type
 * @param {OpenLibraryBook} openLibBook
 * @param {OpenLibraryAuthor} openLibAuthor
 * @return {Boo}
 */
exports.openLibraryToBook = function (openLibBook, openLibAuthor) {
  return {
    title: openLibBook.title,
    fullTitle: openLibBook.full_title,
    publishers: openLibBook.publishers,
    publishDate: openLibBook.publish_date,
    isbn13: openLibBook.isbn_13,
    isbn10: openLibBook.isbn_10,
    author: openLibAuthorToAuthor(openLibAuthor),
  };
};

/**
 * @return {Author} author
 */
function openLibAuthorToAuthor(openLibAuthor) {
  return {
    name: openLibAuthor.name,
    birthDate: openLibAuthor.birth_date,
    bio: openLibAuthor.bio.value,
  }
}
