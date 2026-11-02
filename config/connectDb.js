import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URI;

const connectionDB = mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ Connected to MongoDB database successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("👉 Please ensure the MongoDB Atlas cluster is not paused and IP whitelist is set to 0.0.0.0/0");
  });

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB runtime connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected.");
});

export default connectionDB;
