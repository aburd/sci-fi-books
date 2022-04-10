const { createSpinner } = require('nanospinner');
const { addScifiBook } = require('../src/db');
const { fetchBook } = require('../src/handlers');
const { confirm } = require('../src/util');

const seedIsbns = [
      "9781250214713",
      "9780316212366",
      "9782290330623"
];

async function seed() {
  if (!(await confirm('Are you sure you want to seed the DB?'))) return;
  for (const isbn of seedIsbns) {
    const book = await fetchBook(isbn);
    addScifiBook(book); 
  }
}

seed();
