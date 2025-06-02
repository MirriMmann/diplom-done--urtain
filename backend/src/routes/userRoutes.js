import express from "express";
import { getUsers, updateUserRole } from "../controllers/userController.js"; 
import protect from "../middleware/authMiddleware.js"; 
import admin from "../middleware/adminMiddleware.js"; 
import { deleteUser } from "../controllers/userController.js";



const router = express.Router();
router.delete("/:id", protect, admin, deleteUser);


router.get("/", protect, admin, getUsers);

router.put("/:id/role", protect, admin, updateUserRole);
export default router;
