const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const { askQuestion } = require('../util');

async function createTables(db) {
  const createTablesPath = path.join(__dirname, 'create_tables.sql'); 
  const createTablesSql = fs.readFileSync(createTablesPath, { encoding: 'utf8' });
  return new Promise((res, rej) => {
    db.exec(createTablesSql, (err) => {
      if (err) rej(err);
      res();
    });
  });
}

function checkTableExists(db, tableName) {
  return new Promise((res, rej) => {
    db.get(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';
    `, (err, row) => {
      if (err) rej(err);
      res(row);
    });
  });
}

async function createDatabase(dbPath) {
  const res = await askQuestion(`Would you like to create a DB file at ${dbPath}?`); 
  if (res) {
    return await new Promise((resolve, reject) => {
      const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error(`Error creating DB`, err);
            process.exit(1);
        }
        resolve(db);
      });
    });
  }
  process.exit(0);
}

/**
 * Initialize db and return the db object
 * @param {string?} dbFilepath - the path to the db file, will be created if it
 * doesnt exist
 * @returns {SqliteDB}
 */
async function init(dbFilepath = `${__dirname}/scifibooks.db`) {
  console.log("Connecting to DB...");
  const db = await new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbFilepath, sqlite3.OPEN_READWRITE, (err) => {
      if (err && err.code === 'SQLITE_CANTOPEN') {
        console.log(`No database found at ${dbFilepath}`);
        resolve(createDatabase(dbFilepath));
      } 
      console.log(`Opened DB at ${dbFilepath}`);
    });
    resolve(db);
  });
  
  const tableExists = await checkTableExists(db, 'book_publishers'); 
  if (!tableExists) {
    console.log("Tables not found.");
    console.log("Initializing DB...");
    await createTables(db);
  }
  return db;
}

module.exports = {
  init,
}
