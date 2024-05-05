const { mongoose } = require("../db/db");

const bookSchema = new mongoose.Schema({
  book_id: String,
  book_title: String,
  description: String,
  price: String,
  stock: String,
  genre: String,
  url: String,
  createdAt: Date,
  updatedAt: Date,
});

const Book = new mongoose.model("Book", bookSchema);

module.exports = Book;
