import Genre from "../models/Genre.js";

const genres = [
  "Драма", "Комедия", "Мюзикл", "Трагедия", "Фантастика",
  "Мистерия", "Экспериментальный театр", "Танцевальное шоу", 
  "Сказка", "Документальный театр", "Оперетта", "Детский театр", 
  "Фарс", "Балет", "Романтическая комедия", "Музыкальный", "Романтика", 
  "Лирика", "Триллер", "Народный театр",  "Легенда", "Классика", "Моноспектакль",
  "Современный быт", "Опера"
];

const addGenres = async () => {
  try {
    for (const name of genres) {
      const existing = await Genre.findOne({ name });
      if (!existing) {
        await Genre.create({ name });
        console.log(`Добавлен жанр: ${name}`);
      }
    }
    console.log("Жанры добавлены/обновлены");
  } catch (error) {
    console.error("Ошибка при добавлении жанров:", error);
  }
};

export default addGenres;
