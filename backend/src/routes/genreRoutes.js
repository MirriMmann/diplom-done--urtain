import express from "express";
import { addGenres, getGenres } from "../controllers/genreController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getGenres);

router.post("/add", protect, addGenres);

export default router;
