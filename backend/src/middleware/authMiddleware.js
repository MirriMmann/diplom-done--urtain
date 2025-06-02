import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Полученный токен:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Декодированный токен:", decoded);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({ message: "Пользователь не найден" });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Ошибка верификации токена:", error);
      return res.status(401).json({ message: "Неверный токен" });
    }
  } else {
    console.log("Токен не предоставлен");
    return res
      .status(401)
      .json({ message: "Не авторизован, токен не предоставлен" });
  }
};

export default protect;