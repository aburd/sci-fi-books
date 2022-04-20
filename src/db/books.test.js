const assert = require('assert');
const { faker } = require('@faker-js/faker');
const books = require('./books');
const Db = require('./index');

let db;

beforeEach(async function() {
  db = await Db.init();
});

afterEach(function () {
  db.close();
});

describe('books module', function () {
  it('should be able to get a book from the db', async function () {
    const insertedBook = {
      title: faker.hacker.noun(),
      fullTitle: faker.hacker.noun(),
      publishers: [faker.animal.type()],
      publishDate: new Date().toUTCString(),
      isbn13: faker.phone.phoneNumber(),
      isbn10: faker.phone.phoneNumber(),
      author: null,
    };
    await books.addScifiBook(db, insertedBook);

    const book = await books.getScifiBook(db, insertedBook.isbn13);
    console.log(book);
    assert.ok(book.title, "Book has no title");
    
    await books.deleteScifiBook(db, insertedBook.isbn13);
  });
});
