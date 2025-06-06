import React, { useEffect, useState } from "react";
import axios from "axios";import Header from "../components/Header/Header";
import ShowCard from "../components/ShowCard/ShowCard";
import "../components/styles/ShowCardH.css";

const Home = () => {
  const [shows, setShows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShows = async () => {
      try {
          const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/shows`, {
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
  }, []);

  return (
    <div className="home-page">
      <Header />

      {error && <p className="error">{error}</p>}

      <div className="shows-list">
        <h2>Доступные спектакли</h2>
        {shows.length > 0 ? (
          <ul>
            {shows.map((show) => (
              <ShowCard key={show._id} show={show} />
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
