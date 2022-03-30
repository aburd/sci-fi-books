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
function getScifiBooks() {
  const dbPath = `${__dirname}/fake-db.json`;
  const books = fs.readFileSync(dbPath, { encoding: 'utf8' });
  return JSON.parse(books);
}

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

/**
 * A function that gets book information from API 
 * 
 */
function regByISBN() {
  let isbn;
  const readline = require("readline");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("Enter book ISBN: ", function(isbn) {
    console.log(`Registering ISBN: ${isbn}`);
    console.log("Closing the interface");
    rl.close();
  });
  const apiEndPoint = 'https://openlibrary.org/isbn/';
  const apiSuffix = '.json';
  // const sampleISBN = '9780316212366'
  let apiLookUp = apiEndPoint + isbn + apiSuffix;
  console.log(apiLookUp);
}

regByISBN();