
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    const filteredBooks = Object.values(books).filter(
        book => book.author === author
    );

    res.send(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    const filteredBooks = Object.values(books).filter(
        book => book.title === title
    );

    res.send(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});

// using promises and callback

// GET ALL BOOKS USING PROMISES-AXIOS

public_users.get('/asyncbooks', function (req, res) {

    axios.get('http://localhost:5000/')
        .then((response) => {

            res.status(200).json(response.data);

        })
        .catch((error) => {

            res.status(500).json({
                message: "Error retrieving books",
                error: error.message
            });

        });

});

// GET A BOOK BASED ON ISBN USING PROMISES-AXIOS

public_users.get('/asyncisbn/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then((response) => {

            res.status(200).json(response.data);

        })
        .catch((error) => {

            res.status(404).json({
                message: "Book not found",
                error: error.message
            });

        });

});

// GET A BOOK BASED ON AUTHOR USING PROMISES-AXIOS

public_users.get('/asyncauthor/:author', function (req, res) {

    const author = req.params.author;

    axios.get(`http://localhost:5000/author/${author}`)
        .then((response) => {

            res.status(200).json(response.data);

        })
        .catch((error) => {

            res.status(404).json({
                message: "Author not found",
                error: error.message
            });

        });

});

// GET A BOOK BASED ON TITLE USING PROMISES-AXIOS

public_users.get('/asynctitle/:title', function (req, res) {

    const title = req.params.title;

    axios.get(`http://localhost:5000/title/${title}`)
        .then((response) => {

            res.status(200).json(response.data);

        })
        .catch((error) => {

            res.status(404).json({
                message: "Title not found",
                error: error.message
            });

        });

});



module.exports.general = public_users;
