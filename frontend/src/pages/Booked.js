// frontend/src/pages/Booked.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/styles/Booked.css";

const Booked = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
          const { data: user } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUserName(user.name);

        const { data: bookingsData } = await axios.get(`${process.env.REACT_APP_API_URL}/api/booked`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBookings(bookingsData);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить данные. Попробуйте позже.");
      }
    };

    fetchData();
  }, []);

  const cancelBooking = async (id) => {
    try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/booked/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Ошибка отмены брони:", err);
      setError("Не удалось отменить бронирование. Попробуйте позже.");
    }
  };

  const formatDateTime = (dateStr, timeStr) => {
    const date = new Date(dateStr);
    return `${date.toLocaleDateString("ru-RU")} в ${timeStr}`;
  };

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button className="home-button" onClick={() => navigate("/")}>
          На главную
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="no-bookings">
        <p>У вас пока нет активных бронирований.</p>
        <button className="home-button" onClick={() => navigate("/")}>
          На главную
        </button>
      </div>
    );
  }

return (
  <div className="bookings-container">
    <h2>Мои брони</h2>

    {bookings.map(({ _id, show, seatType }) => {
      const isValid =
        show &&
        typeof show.title === "string" &&
        typeof show.date === "string" &&
        typeof show.time === "string" &&
        typeof show.location === "string";

      if (!isValid) {
        return null;
      }

      return (
        <div key={_id} className="booking-card">
          <h3>{show.title}</h3>
          <p>{show.description}</p>
          <p><strong>Бронировал:</strong> {userName}</p>
          <p><strong>Билет:</strong> {seatType}</p>
          <p><strong>Дата и время:</strong> {formatDateTime(show.date, show.time)}</p>
          <p><strong>Место проведения:</strong> {show.location}</p>
          <button className="cancel-button" onClick={() => cancelBooking(_id)}>
            Отменить бронирование
          </button>
        </div>
      );
    })}

    <button className="home-button" onClick={() => navigate("/")}>
      Вернуться на главную
    </button>
  </div>
);
};

export default Booked;
