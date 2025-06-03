import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/CreateShow.css";

const EditShow = ({ show, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    genres: [],
    poster: '' // существующий постер
  });

  const [posterFile, setPosterFile] = useState(null);
  const [allGenres, setAllGenres] = useState([]);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/genres`);
        setAllGenres(res.data);
      } catch (err) {
        console.error("Ошибка при загрузке жанров:", err);
      }
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    if (show) {
      setFormData({
        title: show.title || '',
        description: show.description || '',
        date: formatDateForInput(show.date),
        time: show.time || '',
        location: show.location || '',
        price: show.price || '',
        genres: show.genres?.map(g => g._id) || [],
        poster: show.poster || ''
      });
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const updatedGenres = checked
        ? [...prev.genres, value]
        : prev.genres.filter(g => g !== value);
      return { ...prev, genres: updatedGenres };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      let posterPath = formData.poster;

      if (posterFile) {
        const uploadData = new FormData();
        uploadData.append("poster", posterFile);

        const uploadRes = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/upload/poster`,

          uploadData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        posterPath = uploadRes.data.path;
      }


      const updatedData = {
  ...formData,
  poster: posterPath,
  price: Number(formData.price), // преобразование в число
  date: new Date(formData.date).toISOString(), // безопасный ISO-формат
};

console.log("Updated data:", updatedData);


      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/shows/${show._id}`,

        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      onSave(response.data);
    } catch (error) {
      console.error("Ошибка при обновлении спектакля:", error);
      alert("Не удалось сохранить изменения");
    }
  };

  return (
    <div className="accordion-show">
      <form className="show-form" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPosterFile(e.target.files[0])}
        />

        {posterFile ? (
          <img
            src={URL.createObjectURL(posterFile)}
            alt="Предпросмотр"
            className="poster-preview"
        />
        ) : formData.poster && (
          <img
            src={`${process.env.REACT_APP_API_URL}${formData.poster}`}
            alt="Текущий постер"
            className="poster-preview"
        />
        )}

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Название"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Описание"
          required
        />

        <div className="row">
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Место проведения"
            required
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Цена"
            required
          />
        </div>

        <div className="genres-container">
          {allGenres.map((genre) => (
            <label key={genre._id} className="genre-tag">
              <input
                type="checkbox"
                value={genre._id}
                checked={formData.genres.includes(genre._id)}
                onChange={handleGenreChange}
              />
              {genre.name}
            </label>
          ))}
        </div>

        <div className="button-row">
          <button type="button" className="cancel" onClick={onClose}>Отмена</button>
          <button type="submit" className="submit">Сохранить</button>
        </div>
      </form>
    </div>
  );
};

export default EditShow;
