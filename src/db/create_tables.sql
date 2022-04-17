CREATE TABLE authors (
  id int PRIMARY KEY NOT NULL,
  name text NOT NULL,
  bio text DEFAULT ''
);

CREATE TABLE publishers (
  id int PRIMARY KEY NOT NULL,
  name text NOT NULL
);

CREATE TABLE books (
  id int PRIMARY KEY NOT NULL,
  title text NOT NULL,
  full_title text,
  publish_date text NOT NULL,
  isbn13 text NOT NULL,
  isbn10 text NOT NULL,
  author_id REFERENCES authors
);

CREATE TABLE book_publishers ( 
  id int PRIMARY KEY NOT NULL,
  publisher_id REFERENCES publishers NOT NULL,
  book_id REFERENCES books NOT NULL
);
