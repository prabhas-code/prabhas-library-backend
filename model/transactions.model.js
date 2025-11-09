import mongoose from "mongoose";

const TransactionsSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    book_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Book",
      required: true,
    },

    issuedAt: {
      type: Date,
      required: true,
    },

    returnAt: {
      type: Date,
      required: true,
    },
    returned: {
      type: Boolean,
      default: false,
    },
    returnedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction", TransactionsSchema);

// Transactions[icon : clipboard]{
//   user_id ObjectId Users
//   book_id ObjectId books
//   issuedAt Date
//   returnAt Date

// }
