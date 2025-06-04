import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "../components/styles/SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Ошибка при поиске:", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchResults();
  }, [query]);

  if (loading) return <div className="search-container"><p>Загрузка...</p></div>;

  return (
    <div className="search-container">
      <div className="search-content">
        <h3>Результаты поиска по: "{query}"</h3>
        {results.length === 0 ? (
          <p>Ничего не найдено</p>
        ) : (
          <div className="search-grid">
            {results.map(show => (
              <div className="search-card" key={show._id}>
                <h4>{show.title}</h4>
                <p>Жанры: {show.genres.map(g => g.name).join(", ")}</p>
                <Link to={`/show/${show._id}`} className="search-button">Перейти</Link>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => navigate("/")} className="search-back-button">
          На главную
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
