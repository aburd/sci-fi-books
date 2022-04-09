function isIsbnValid(isbn) {
  const isbnRegex = /^(97(8|9))?\d{9}(\d|X)$/;
  return isbnRegex.test(isbn); 
}

function emphasize(s) {
  const lines = s.split('\n').map(s => s.length);
  const longestLen = Math.max(...lines);
  const stars = "*".repeat(longestLen);
  return `\n${stars}\n${s}\n${stars}\n`;
}

module.exports = {
  isIsbnValid,
  emphasize,
}

