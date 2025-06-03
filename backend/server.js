import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./src/routes/authRoutes.js";
import showRoutes from "./src/routes/showRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import genreRoutes from "./src/routes/genreRoutes.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import connectDB from "./src/config/db.js";
import User from "./src/models/User.js";
import searchRoutes from "./src/routes/searchRoutes.js";
import addGenres from "./src/scripts/addGenres.js";


dotenv.config();
const app = express();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors({
  origin: "diplom-done-urtain.vercel.app", 
  credentials: true,
}));

app.use("/posters", express.static(path.join(__dirname, "public/posters")));

app.use("/api/auth", authRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/booked", bookingRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));

const createAdmin = async () => {
  try {
    const adminEmail = "admin@qwe.com";
    const adminPassword = "pass";
    const adminName = "Админ";

    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      admin = new User({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });

      await admin.save();
      console.log("Админ создан:", {
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
    } else {
      console.log("Админ уже существует:", {
        name: admin.name,
        email: admin.email,
        password: adminPassword,
        role: admin.role,
      });
    }
  } catch (error) {
    console.error("Ошибка при создании админа:", error);
  }
};

createAdmin();
addGenres();

