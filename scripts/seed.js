const { open } = require('lmdb');
const { initBooksDb } = require('../src/db/books');
const { fetchBook } = require('../src/handlers');
const { confirm, getDbPath } = require('../src/util');
require('dotenv').config();

const seedIsbns = [
      "9781250214713",
      "9780316212366",
      "9782290330623"
];

const db = open({
	path: getDbPath(),
	// any options go here, we can turn on compression like this:
	compression: true,
});
const booksDb = initBooksDb(db);

async function seed() {
  if (!(await confirm('Are you sure you want to seed the DB?'))) return;
  for (const isbn of seedIsbns) {
    const book = await fetchBook(isbn);
    await booksDb.addScifiBook(book); 
  }
}

seed();
