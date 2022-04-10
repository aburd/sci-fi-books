const fs = require('fs/promises');
const { resetDb } = require('../src/db');
const { confirm } = require('../src/util');

async function empty() {
  if (await confirm('Are you sure you want to reset the DB?')) {
    await resetDb();
  }
}

empty();
