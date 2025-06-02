import express from "express";
import {
  addShow,
  getShows,
  getShowById,
  editShow,
  deleteShow
} from "../controllers/showController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .get(getShows)
  .post(protect, addShow);

router.route("/:id")
  .get(getShowById)
  .put(protect, editShow)
  .delete(protect, deleteShow);
  
export default router;


