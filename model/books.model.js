import mongoose from "mongoose";

const BookSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      required: true,
      trim: true,
    },
    availableCopies: {
      type: Number,
      required: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },

    thumbnailphoto: {
      type: String,
      trim: true,
      default: null,
    },
    author: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    publishedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", BookSchema);
