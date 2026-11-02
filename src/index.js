import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectionDB from "../config/connectDb.js";

dotenv.config();

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 8000;

// ================================================================
// ⭐ ROBUST CORS (Supports Vercel production + previews, localhost)
// ================================================================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://prabhas-library-frontend.vercel.app",
  process.env.FRONTEND_URL,
]
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Health check endpoint
app.get("/", (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: "ok",
    message: "Libraverse Backend API is running 🚀",
    database: isDbConnected ? "connected" : "disconnected / connecting",
  });
});

// ================================================================
// Routes
// ================================================================
import { userRouter } from "../routes/user.routes.js";
import { bookRouter } from "../routes/book.routes.js";
import { transactionRouter } from "../routes/transaction.routes.js";
import paymentRouter from "../routes/payment.routes.js";
import aiRouter from "../routes/ai.routes.js";

app.use("/", userRouter);
app.use("/", bookRouter);
app.use("/", transactionRouter);
app.use("/", paymentRouter);
app.use("/ai", aiRouter);

// ================================================================
// Start Server
// ================================================================
const startServer = async () => {
  try {
    await connectionDB;

    console.log("✅ MongoDB connected. Starting server...");

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`Frontend allowed: ${frontendUrl}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  }
};

startServer();
