import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGO_URI;

const connectionDB = mongoose
  .connect(uri)
  .then(() => {
    console.log("✅ connected to dataabase");
  })
  .catch((err) => {
    console.log(`❌ connection error ${err}`);
  });

export default connectionDB;
