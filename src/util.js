/**
 * Tells you if the string is a valid ISBN 10 or 13
 *
 * @param {string} isbn
 * @returns {boolean} valid
 */
function isIsbnValid(isbn) {
  const isbnRegex = /^(97(8|9))?\d{9}(\d|X)$/;
  return isbnRegex.test(isbn); 
}

/**
 * Wraps the string with line breaks and stars to make it stand
 * out.
 *
 * @param {string} s
 * @return {string}
 */
function emphasize(s) {
  const lines = s.split('\n').map(s => s.length);
  const longestLen = Math.max(...lines);
  const stars = "*".repeat(longestLen);
  return `\n${stars}\n${s}\n${stars}\n`;
}

/**
 * Will split a string into a array of string, broken on newlines.
 * maxWidth, if positive will recursively split longer lines into lines
 * that are less than length of maxWidth
 *
 * @param {string} s
 * @param {number} maxWidth
 * @return {string[]} lines
 */
function splitToLines(s, maxWidth = 0) {
  const lines = s.split('\n');
  if (!maxWidth) {
    return lines;
  }
  const reg = new RegExp(`.{1,${maxWidth}}`, "g");
  return lines.reduce((ls, l) => {
    if (l.length <= maxWidth) {
      ls.push(l);
      return ls;
    }
    const chunks = l.match(reg);
    return [...ls, ...chunks]; 
  }, []);
}

/**
 * Returns your text in card form.
 * No input returns empty string.
 * Only title returns a card with no body.
 * More than one line of text returns a title separated from the body.
 *
 * @param {string} s
 * @param {number} maxWidth - max length of one line 
 */
function cardFromString(s, maxWidth = 0) {
  if (!s) return '';
  const lines = splitToLines(s, maxWidth);
  const width = Math.max(...lines.map(l => l.length));
  const [title, ...body] = lines; 
  const horizontalLine = ` ${"=".repeat(width + 4)} `;
  const addPadding = (s) => {
    const paddingLen = width - s.length;
    return s + " ".repeat(paddingLen);
  };
  const makeCardContent = (s) => `|  ${addPadding(s)}  |`;
  const emptyLine = makeCardContent(" ".repeat(width)); 
  const titleCard = `${horizontalLine}
${emptyLine}
${makeCardContent(title)}
${emptyLine}
${horizontalLine}`;

  if (!body.length) return titleCard;

  return `${titleCard}
${emptyLine}
${body.map(makeCardContent).join('\n')}
${emptyLine}
${horizontalLine}`;
}

module.exports = {
  isIsbnValid,
  emphasize,
  splitToLines,
  cardFromString,
}

