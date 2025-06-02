import Show from "../models/Show.js";
import Genre from "../models/Genre.js";
import mongoose from "mongoose";
import User from "../models/User.js";

const addShow = async (req, res) => {
  if (req.user.role !== 'creator' && req.user.role !== 'admin') {
    return res.status(403).json({ message: "Недостаточно прав для добавления спектакля" });
  }


  let { title, description, date, time, location, price, genres, poster } = req.body;
  
  if (typeof genres === "string") {
    genres = [genres];
  }

  if (!title || !description || !date || !time || !location || !price || !genres || genres.length === 0) {
    return res.status(400).json({ message: "Все поля обязательны для заполнения, включая жанры" });
  }
  

  try {
    const validGenres = await Genre.find({ _id: { $in: genres } });
    if (validGenres.length !== genres.length) {
      return res.status(400).json({ message: "Некоторые жанры не существуют" });
    }

    const newShow = new Show({
      poster,
      title,
      description,
      date,
      time,
      location,
      price,
      genres,
      createdBy: req.user.id,
    });

    await newShow.save();
    res.status(201).json({ message: "Спектакль успешно добавлен!", newShow });
  } catch (error) {
    console.error("Ошибка при добавлении спектакля:", error);
    res.status(500).json({ message: "Ошибка при добавлении спектакля", error: error.message });
  }
};

const getShows = async (req, res) => {
  try {
    const shows = await Show.find()
      .populate("createdBy", "email role")
      .populate("genres", "name");
    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении спектаклей", error });
  }
};

const editShow = async (req, res) => {
  const { id } = req.params;
  let { title, description, date, time, location, price, genres, poster } = req.body;

  if (typeof genres === "string") {
    genres = [genres];
  }

  try {
    const show = await Show.findById(id);

    if (!show) {
      return res.status(404).json({ message: "Спектакль не найден" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Доступ запрещен" });
    }

    if (genres && genres.length > 0) {
      const validGenres = await Genre.find({ _id: { $in: genres } });
      if (validGenres.length !== genres.length) {
        return res.status(400).json({ message: "Некоторые жанры не существуют" });
      }

      show.genres = genres;
    }

    show.poster = poster || show.poster;
    show.title = title || show.title;
    show.description = description || show.description;
    show.date = date || show.date;
    show.time = time || show.time;
    show.location = location || show.location;
    show.price = price || show.price;

    await show.save();

    res.status(200).json({ message: "Спектакль успешно обновлён", show });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при редактировании спектакля", error: error.message });
  }
};

const deleteShow = async (req, res) => {
  const { id } = req.params;

  try {
    const show = await Show.findById(id);

    if (!show) {
      return res.status(404).json({ message: "Спектакль не найден" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Доступ запрещен" });
    }

    await Show.deleteOne({ _id: id });

    res.status(200).json({ message: "Спектакль успешно удалён" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении спектакля", error: error.message });
  }
};

export const getShowById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Неверный ID" });
  }

  try {
    const show = await Show.findById(id).populate("genres");
    if (!show) {
      return res.status(404).json({ message: "Спектакль не найден" });
    }
    res.status(200).json(show);
  } catch (error) {
    console.error("Ошибка при получении спектакля:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};


export { addShow, getShows, editShow, deleteShow };