const fetch = require("node-fetch");

const openLibraryURL = "https://openlibrary.org";
const bookEndPoint = "/isbn/";
const apiSuffix = ".json";

async function getBook(isbn) {
  const bookURL = openLibraryURL + bookEndPoint + isbn + apiSuffix;
  const bookResponse = await fetch(bookURL);
  return await bookResponse.json();
}

async function searchTitle(search) {
  const url = `${openLibraryURL}/search.json?title=${encodeURI(search)}`;
  const res = await fetch(url);
  return await res.json();
}

async function searchAuthor(search) {
  const url = `${openLibraryURL}/search.json?author=${encodeURI(search)}`;
  const res = await fetch(url);
  return await res.json();
}

async function getAuthor(authorKey) {
  const authorURL = openLibraryURL + authorKey + apiSuffix;
  const authorResponse = await fetch(authorURL);
  return await authorResponse.json();
}

module.exports = {
  getBook,
  getAuthor,
  searchTitle,
  searchAuthor,
}
