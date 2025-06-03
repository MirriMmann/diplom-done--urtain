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

// Список разрешенных доменов для CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://diplom-done-urtain.vercel.app",
  "https://diplom-done-urtain-git-main-mirrimmanns-projects.vercel.app",
  "https://diplom-done-urtain-lmzzd97m3-mirrimmanns-projects.vercel.app"
];

// Настройка CORS с проверкой origin
app.use(cors({
  origin: (origin, callback) => {
    // Разрешить запросы с серверов без origin (например, Postman) или с origin из allowedOrigins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy violation: ${origin} не разрешён`));
    }
  },
  credentials: true,
}));

// Обработка preflight-запросов (OPTIONS)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
    }
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());

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
    const adminPassword = "ssaP1";
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
