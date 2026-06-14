const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        const userExists = users.some(user => user.username === username);
        if (!userExists) {
            users.push({"username":username,"password":password});
            return res.status(201).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(409).json({message: "User already exists!"});
        }
    }
    return res.status(400).json({message: "Unable to register user. Please provide both username and password."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.json(books[isbn]);
    } else {
        return res.status(404).json({message: "Book not found"});
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = [];
    for (const bookId in books) {
        if (books[bookId].author === author) {
            booksByAuthor.push(books[bookId]);
        }
    }
    if (booksByAuthor.length > 0) {
        return res.json(booksByAuthor);
    } else {
        return res.status(404).json({message: "No books found by this author"});
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = [];
    for (const bookId in books) {
        if (books[bookId].title === title) {
            booksByTitle.push(books[bookId]);
        }
    }
    if (booksByTitle.length > 0) {
        return res.json(booksByTitle);
    } else {
        return res.status(404).json({message: "No books found with this title"});
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn] && books[isbn].reviews) {
        return res.json(books[isbn].reviews);
    } else {
        return res.status(404).json({message: "Reviews not found for this book"});
    }
});


// Task 10: Get all books using async/await with Axios
public_users.get('/', async function (req, res) {
    try {
        // Simulate an async fetch (normally you'd use an API endpoint here)
        const getBooks = () => {
            return new Promise((resolve, reject) => {
                resolve(books);
            });
        };
        const allBooks = await getBooks();
        res.send(JSON.stringify(allBooks, null, 4));
    } catch (err) {
        res.status(500).json({message: "Error fetching books"});
    }
});

// Task 11: Get book details by ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const getBookByIsbn = (isbn) => {
            return new Promise((resolve, reject) => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject("Book not found");
                }
            });
        };
        const book = await getBookByIsbn(isbn);
        res.json(book);
    } catch (err) {
        res.status(404).json({message: err});
    }
});

// Task 12: Get books by author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const getBooksByAuthor = (author) => {
            return new Promise((resolve, reject) => {
                const booksByAuthor = [];
                for (const bookId in books) {
                    if (books[bookId].author === author) {
                        booksByAuthor.push(books[bookId]);
                    }
                }
                if (booksByAuthor.length > 0) {
                    resolve(booksByAuthor);
                } else {
                    reject("No books found by this author");
                }
            });
        };
        const booksByAuthor = await getBooksByAuthor(author);
        res.json(booksByAuthor);
    } catch (err) {
        res.status(404).json({message: err});
    }
});

// Task 13: Get books by title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const getBooksByTitle = (title) => {
            return new Promise((resolve, reject) => {
                const booksByTitle = [];
                for (const bookId in books) {
                    if (books[bookId].title === title) {
                        booksByTitle.push(books[bookId]);
                    }
                }
                if (booksByTitle.length > 0) {
                    resolve(booksByTitle);
                } else {
                    reject("No books found with this title");
                }
            });
        };
        const booksByTitle = await getBooksByTitle(title);
        res.json(booksByTitle);
    } catch (err) {
        res.status(404).json({message: err});
    }
});
// Task 11 - Get all books using async/await with Axios
const getAllBooks = async () => {
    try {
        const response = await axios.get("http://localhost:5000/");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting all books:", error.message);
    }
};

// Get book details based on ISBN using Promise with Axios
const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:5000/isbn/${isbn}`)
            .then(response => {
                console.log(response.data);
                resolve(response.data);
            })
            .catch(error => {
                console.error("Error getting book by ISBN:", error.message);
                reject(error);
            });
    });
};

// Get books by author using async/await with Axios
const getBooksByAuthor = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting books by author:", error.message);
    }
};

// Get books by title using async/await with Axios
const getBooksByTitle = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error getting books by title:", error.message);
    }
};
module.exports.general = public_users;
module.exports.general = public_users;
