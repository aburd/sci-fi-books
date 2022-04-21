const { init } = require('../src/db');
const { addScifiBook } = require('../src/db/books');
const { fetchBook } = require('../src/handlers');
const { confirm } = require('../src/util');

const seedIsbns = [
      "9781250214713",
      "9780316212366",
      "9782290330623"
];

async function seed() {
  const db = await init();
  if (!(await confirm('Are you sure you want to seed the DB?'))) return;
  for (const isbn of seedIsbns) {
    const book = await fetchBook(isbn);
    addScifiBook(db, book); 
  }
}

seed();
