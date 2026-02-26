import express from "express";
import { generateBookDescription } from "../controllers/ai.controllers.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import isAuthor from "../middlewares/isauthor.middlewares.js";

const router = express.Router();

router.post(
  "/generate-description",
  verifyToken,
  isAuthor,
  generateBookDescription
);

export default router;
