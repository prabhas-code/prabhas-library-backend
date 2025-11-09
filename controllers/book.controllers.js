import { Book } from "../model/books.model.js";
import User from "../model/users.model.js";
import { bookRouter } from "../routes/book.routes.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//********author*********
const createBook = async (req, res) => {
  try {
    const { name, description, genre, availableCopies, price } = req.body;
    const file = req.file;
    let fileUrl = null;
    if (file) {
      // upload file to cloudinary
      const cloudinaryResponse = await uploadOnCloudinary(file.path);
      fileUrl = cloudinaryResponse.url;
    }
    const authorName = await User.findById(req.user.id);
    const book = await Book.create({
      name,
      description,
      genre,
      availableCopies,
      price,
      thumbnailphoto: fileUrl,
      author: req.user.id || null,
      authorName: authorName.name || "Unknown",
    });

    await book.save();
    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getBooks = async (req, res) => {
  try {
    let books;
    console.log("req obj", req);

    if (req.user.role === "author") {
      books = await Book.find({ author: req.user._id });
    }

    res
      .status(200)
      .json({ message: " books fetched successfully", books: books });
  } catch (error) {
    console.log(error);
    res.status(401).json("Some thing went wrong");
  }
};

const bookdetails = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId).populate(
      "author",
      "fullname email"
    );
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ book });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json("Book not Found");
    }

    // ensure only the book owner (author) can update
    if (
      req.user.role === "author" &&
      book.author.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json("Unauthorized Not your book");
    }

    // Apply only the fields present in req.body (don't blindly overwrite thumbnail)
    const updatableFields = [
      "name",
      "genre",
      "description",
      "price",
      "availableCopies",
      "author",
    ];
    updatableFields.forEach((f) => {
      if (Object.prototype.hasOwnProperty.call(req.body, f)) {
        book[f] = req.body[f];
      }
    });

    // If a file was uploaded, upload it to cloudinary and set thumbnailphoto
    if (req.file) {
      const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
      if (cloudinaryResponse && cloudinaryResponse.url) {
        book.thumbnailphoto = cloudinaryResponse.url;
      } else {
        // If upload failed, you may choose to keep old image or return error.
        // I'll return an error to be explicit:
        return res.status(500).json("Failed to upload thumbnail");
      }
    }

    await book.save();
    res.status(201).json({ message: "Updated successfully", book: book });
  } catch (error) {
    console.log("updateBook error:", error);
    res.status(500).json("Server error");
  }
};
const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      return res.status(404).json("Book not found");
    }
    res.status(200).json("Book deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const searchBook = async (req, res) => {
  try {
    const query = req.query.query;
    const regex = new RegExp(query, "i"); // case-insensitive

    const books = await Book.find({
      $or: [{ name: regex }, { genre: regex }, { description: regex }],
    }).populate("author", "fullname");

    res.status(200).json({ message: "Search results", books });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  createBook,
  getBooks,
  updateBook,
  deleteBook,
  bookdetails,
  searchBook,
};
