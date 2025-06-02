import express from "express";
import Show from "../models/Show.js";
import Genre from "../models/Genre.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { query } = req.query;

  try {
    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Пустой поисковый запрос" });
    }

    const genreMatches = await Genre.find({
      name: { $regex: query, $options: "i" },
    });

    const genreIds = genreMatches.map((g) => g._id);

    const shows = await Show.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { genres: { $in: genreIds } },
      ],
    }).populate("genres");

    res.status(200).json(shows);
  } catch (error) {
    console.error("Ошибка при поиске:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
