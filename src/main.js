const { getScifiBooks } = require('./db');

/**
 * Displays the books, for now we will just print the books
 * to the terminal
 * @param books {Book[]}
 */
function displayBooks(books) {
  for (const book of books) {
    console.log(`- ${book.title}`);
  }
}

function main() {
  console.log('Are you ready for some dang sci-fi books?');
  const books = getScifiBooks();
  displayBooks(books); 
}

main();
