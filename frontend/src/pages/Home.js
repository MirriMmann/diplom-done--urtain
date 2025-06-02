import React, { useEffect, useState } from "react";
import axios from "axios";import Header from "../components/Header/Header";
import ShowCard from "../components/ShowCard/ShowCard"; // Импортируем новый компонент
import "../components/styles/ShowCardH.css";

const Home = () => {
  const [shows, setShows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/shows", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setShows(data);
      } catch (error) {
        setError("Ошибка при загрузке спектаклей.");
      }
    };

    fetchShows();
  }, []); // empty dependency array to run once on mount

  return (
    <div className="home-page">
      <Header /> {/* Шапка, теперь кнопка "Выйти" будет тут */}

      {error && <p className="error">{error}</p>}

      <div className="shows-list">
        <h2>Доступные спектакли</h2>
        {shows.length > 0 ? (
          <ul>
            {shows.map((show) => (
              <ShowCard key={show._id} show={show} /> // Используем новый компонент
            ))}
          </ul>
        ) : (
          <p>Спектакли не найдены.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
