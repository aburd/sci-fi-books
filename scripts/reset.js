const { init, resetDb } = require('../src/db');
const { confirm } = require('../src/util');

async function empty() {
  const db = await init();
  if (await confirm('Are you sure you want to reset the DB?')) {
    await resetDb(db);
  }
}

empty();
