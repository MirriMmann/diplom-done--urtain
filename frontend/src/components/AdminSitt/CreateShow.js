// frontend/src/components/AdminSitt/CreateShow.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CreateShow.css"; // Стили остаются прежними

const CreateShow = ({ onClose }) => {
  const [posterFile, setPosterFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/genres");
        setGenres(res.data);
      } catch (error) {
        console.error("Ошибка при загрузке жанров:", error);
      }
    };
    fetchGenres();
  }, []);

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setSelectedGenres((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

const handleAddShow = async (e) => {
  e.preventDefault();
  setErrorMessage("");

  try {
    const token = localStorage.getItem("token");
    let posterPath = "";

    // Если выбран файл — загружаем его отдельно
    if (posterFile) {
      const formData = new FormData();
      formData.append("poster", posterFile);

      const uploadRes = await axios.post(
        "http://localhost:5000/api/upload/poster",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      posterPath = uploadRes.data.path; // Например: "/posters/filename.jpg"
    }

    // Затем создаём спектакль
    await axios.post(
      "http://localhost:5000/api/shows",
      {
        title,
        description,
        date,
        time,
        location,
        price,
        genres: selectedGenres,
        poster: posterPath,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    onClose();
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    setErrorMessage(`Ошибка: ${errorMsg}`);
  }
};

  return (
    <div className="accordion-show">
      <form className="show-form" onSubmit={handleAddShow}>
        <h3>Новый спектакль</h3>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPosterFile(e.target.files[0])}
        />

        <input
          type="text"
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          required
        />
        <small>{title.length}/80 символов</small>

        <textarea
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={400}
          required
        />
        <small>{description.length}/400 символов</small>


        <div className="row">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>

        <div className="row">
          <input
            type="text"
            placeholder="Место проведения"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Цена"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="genres-container">
          {genres.map((g) => (
            <label key={g._id} className="genre-tag">
              <input
                type="checkbox"
                value={g._id}
                checked={selectedGenres.includes(g._id)}
                onChange={handleGenreChange}
              />
              {g.name}
            </label>
          ))}
        </div>

        <div className="button-row">
          <button type="button" className="cancel" onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className="submit">
            Создать
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateShow;
