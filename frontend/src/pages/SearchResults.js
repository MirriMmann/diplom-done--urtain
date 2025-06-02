import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/search?query=${encodeURIComponent(query)}`);
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

  if (loading) return <div className="accordion-show"><p>Загрузка...</p></div>;

  return (
    <div className="accordion-show">
      <div className="show-form">
        <h3>Результаты поиска по: "{query}"</h3>
        {results.length === 0 ? (
          <p>Ничего не найдено</p>
        ) : (
          <ul>
            {results.map(show => (
              <li key={show._id}>
                <Link to={`/show/${show._id}`}>
                  <strong>{show.title}</strong>
                </Link>{" "}
                — Жанры: {show.genres.map(g => g.name).join(", ")}
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => navigate("/")} className="back-button">
          На главную
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
