const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  } else {
    return res.status(404).json({ message: "Unable to register user." });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  res.send(JSON.stringify(books[req.params.isbn]));
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  res.send(
    JSON.stringify(
      Object.entries(books).filter(
        (book) =>
          book[1].author.replaceAll(" ", "").toLocaleLowerCase() ==
          req.params.author.toLocaleLowerCase(),
      ),
    ),
  );
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  res.send(
    JSON.stringify(
      Object.entries(books).filter(
        (book) =>
          book[1].title.replaceAll(" ", "").toLocaleLowerCase() ==
          req.params.title.toLocaleLowerCase(),
      ),
    ),
  );
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  res.send(JSON.stringify(books[req.params.isbn].reviews));
});

module.exports.general = public_users;
