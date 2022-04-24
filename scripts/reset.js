const { confirm } = require('../src/util');
const { open } = require('lmdb');
const { initBooksDb } = require('../src/db/books');

const db = open({
	path: 'scifibooks',
	// any options go here, we can turn on compression like this:
	compression: true,
});
const booksDb = initBooksDb(db);

async function empty() {
  if (await confirm('Are you sure you want to reset the DB?')) {
    await booksDb.resetDb();
  }
}

empty();
