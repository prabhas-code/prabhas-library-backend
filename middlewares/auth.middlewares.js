import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/users.model.js";
import cookies from "cookie-parser";
dotenv.config();

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.AccessToken;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY);
    // decoded should have {_id, iat,exp}
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    console.log("user from auth middleware", user);

    req.user = user;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default { verifyToken };
