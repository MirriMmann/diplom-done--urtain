import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import UseTable from "../components/AdminSitt/UseTable";
import CreateShow from "../components/AdminSitt/CreateShow";
import EditShow from "../components/AdminSitt/EditShow";
import "../components/styles/AdminPanel.css";
import "../components/styles/CreateShow.css";
import "../components/styles/editShows.css";

const AdminPanel = () => {
  const [showUsers, setShowUsers] = useState(false);
  const [showCreateShow, setShowCreateShow] = useState(false);
  const [showEditShow, setShowEditShow] = useState(false);
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const fetchShows = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/shows");
        const data = await response.json();
        setShows(data);
      } catch (error) {
        console.error("Ошибка при загрузке спектаклей:", error);
      }
    };
    fetchShows();
  }, [token]);

  if (!token) {
    return <Navigate to="/404" />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getFullYear()}`;
  };

  const handleShowUsers = () => setShowUsers((prev) => !prev);
  const handleCreateShowClick = () => setShowCreateShow((prev) => !prev);
  const handleEditShowPanel = () => setShowEditShow((prev) => !prev);

  const handleEditShow = (show) => setSelectedShow(show);

  const handleDeleteShow = async (showId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/shows/${showId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setShows((prevShows) => prevShows.filter((show) => show._id !== showId));
      } else {
        console.error("Ошибка при удалении спектакля");
      }
    } catch (error) {
      console.error("Ошибка при удалении спектакля:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleCloseModal = () => {
    setShowCreateShow(false);
    setSelectedShow(null);
  };

  const handleSaveShow = (updatedShow) => {
    setShows((prevShows) =>
      prevShows.map((show) => (show._id === updatedShow._id ? updatedShow : show))
    );
    setSelectedShow(null);
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Панель администратора</h1>
        <div className="admin-buttons">
          <button onClick={handleShowUsers}>
            {showUsers ? "Скрыть пользователей" : "Все пользователи"}
          </button>
          <button onClick={handleCreateShowClick}>
            {showCreateShow ? "Скрыть" : "Создать спектакль"}
          </button>
          <button onClick={handleEditShowPanel}>
            {showEditShow ? "Скрыть редактирование" : "Редактировать спектакли"}
          </button>
          <button onClick={handleLogout}>Выйти</button>
        </div>
      </header>

      <div className="admin-content">
        {showUsers && <UseTable />}

        {showEditShow && (
          <div className="shows-edit-list">
            {shows.length > 0 ? (
              shows.map((show) => (
                <div key={show._id} className="show-edit-card">
                  <div className="show-edit-card-header">
                    <h3>{show.title}</h3>
                    <p>{formatDate(show.date)}</p>
                    <p>{show.location}</p>
                  </div>
                  <div className="show-edit-card-buttons">
                    <button onClick={() => handleEditShow(show)}>Редактировать</button>
                    <button onClick={() => handleDeleteShow(show._id)}>Удалить</button>
                  </div>
                </div>
              ))
            ) : (
              <p>Загрузка спектаклей...</p>
            )}
          </div>
        )}

        {selectedShow && (
          <div className="modal">
            <div className="modal-edit-content">
              <EditShow show={selectedShow} onClose={handleCloseModal} onSave={handleSaveShow} />
            </div>
          </div>
        )}

        {showCreateShow && <CreateShow onClose={handleCloseModal} />}
      </div>
    </div>
  );
};

export default AdminPanel;
