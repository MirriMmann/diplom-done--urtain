import Genre from '../models/Genre.js';

const addGenres = async (req, res) => {
  const genres = [
    "Драма", "Комедия", "Мюзикл", "Трагедия", "Фантастика",
    "Мистерия", "Экспериментальный театр", "Танцевальное шоу",
    "Сказка", "Документальный театр", "Оперетта", "Детский театр",
    "Фарс", "Балет", "Романтическая комедия", "Музыкальный", "Романтика",  
    "Лирика", "Триллер", "Народный театр", "Легенда", "Классика", "Моноспектакль",
    "Современный быт", "Опера"
  ];

  try {
    const operations = genres.map(async (genreName) => {
      const exists = await Genre.findOne({ name: genreName });
      if (!exists) {
        const genre = new Genre({ name: genreName });
        await genre.save();
      }
    });

    await Promise.all(operations);

    res.status(201).json({ message: 'Жанры успешно добавлены' });
  } catch (error) {
    console.error('Ошибка при добавлении жанров:', error);
    res.status(500).json({ message: 'Ошибка при добавлении жанров', error: error.message });
  }
};

const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    console.log('Жанры на сервере:', genres);
    res.status(200).json(genres);
  } catch (error) {
    console.error('Ошибка при получении жанров:', error);
    res.status(500).json({ message: 'Ошибка при получении жанров', error: error.message });
  }
};

export { addGenres, getGenres };