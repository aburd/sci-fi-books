CREATE TABLE authors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name text NOT NULL,
  bio text DEFAULT ''
);

CREATE TABLE publishers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name text NOT NULL
);

CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title text NOT NULL,
  full_title text,
  publish_date text NOT NULL,
  isbn13 text NOT NULL,
  isbn10 text NOT NULL,
  author_id REFERENCES authors
);

CREATE TABLE book_publishers ( 
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  publisher_id REFERENCES publishers NOT NULL,
  book_id REFERENCES books NOT NULL
);
