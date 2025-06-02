import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Пользователь уже существует" });

    const user = await User.create({
      name, 
      email,
      password,
      role: role || "user",
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: "Ошибка при создании пользователя" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Вход:", { email, password });
    const user = await User.findOne({ email });
    console.log("Найденный пользователь:", user);

    if (!user) {
      console.log(`Пользователь с email ${email} не найден`);
      return res.status(401).json({ message: "Неверный email или пароль" });
    }

    console.log("Проверяем пароль для:", user.email);
    console.log("Введённый пароль:", password);
    console.log("Хранимый хешированный пароль:", user.password);

    const isMatch = await user.matchPassword(password);
    console.log("Результат сравнения пароля:", isMatch);

    if (isMatch) {
      res.json({
        _id: user._id,
        name: user.name, 
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: "Неверный email или пароль" });
    }
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

export const getUserProfile = async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } else {
    res.status(404).json({ message: "Пользователь не найден" });
  }
};

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};