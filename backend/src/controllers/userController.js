import User from "../models/User.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users); 
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    res.status(500).json({ message: "Ошибка сервера при получении пользователей" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    const { role } = req.body;

    if (!role || !['user', 'admin', 'creator'].includes(role)) {
      return res.status(400).json({ message: "Неверная роль" });
    }

    user.role = role;
    await user.save();

    res.json({ message: "Роль пользователя обновлена", user });
  } catch (error) {
    console.error("Ошибка при обновлении роли пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера при обновлении роли" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    await user.deleteOne();
    res.json({ message: "Пользователь удалён успешно" });
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};