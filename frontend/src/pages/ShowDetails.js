import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/styles/ShowDetails.css";

const seatTypes = [
  { label: "Стандарт", priceMultiplier: 1 },
  { label: "Премиум", priceMultiplier: 1.5 },
  { label: "VIP", priceMultiplier: 2 },
];

const ShowDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [genres, setGenres] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    seatType: "Стандарт",
    tickets: 1,
  });

  useEffect(() => {
    const fetchShow = async () => {
      const res = await axios.get(`http://localhost:5000/api/shows/${id}`);
      setShow(res.data);
    };

    const fetchGenres = async () => {
      const res = await axios.get("http://localhost:5000/api/genres");
      setGenres(res.data);
    };

    fetchShow();
    fetchGenres();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "tickets" ? parseInt(value) : value,
    }));
  };

  const calculateTotal = () => {
    const basePrice = show?.price || 0;
    const multiplier = seatTypes.find((s) => s.label === formData.seatType)?.priceMultiplier || 1;
    return basePrice * multiplier * formData.tickets;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/booked",
        {
          show: show._id,
          seatType: formData.seatType,
          tickets: formData.tickets,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSubmitted(true);
      setTimeout(() => {
        navigate("/booked");
      }, 1500);
    } catch (err) {
      console.error("Ошибка при бронировании:", err);
      alert("Не удалось забронировать билет. Проверьте данные или авторизуйтесь.");
    }
  };

  if (!show) return <p>Загрузка...</p>;

  const showGenres = show.genres
    .map((genre) => genres.find((g) => g._id === genre._id)?.name)
    .filter(Boolean);

  return (
    <div className="show-details-container">
      <button className="back-btn" onClick={() => navigate(-1)}>Назад</button>
      <h2 className="show-title">{show.title}</h2>

      <div className="show-details-layout">
        {show.poster && (
          <img
            src={`http://localhost:5000${show.poster}`}
            alt={show.title}
            className="show-details-image"
          />
        )}
        <div className="show-info">
          <p><strong>Описание:</strong> {show.description}</p>
          <p><strong>Дата:</strong> {formatDate(show.date)} в {show.time}</p>
          <p><strong>Место:</strong> {show.location}</p>
          <p><strong>Цена:</strong> {show.price} сом</p>
          {showGenres.length > 0 && <p><strong>Жанры:</strong> {showGenres.join(", ")}</p>}
        </div>
      </div>

      <button className="buy-btn" onClick={() => setModalOpen(true)}>Купить билет</button>

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalOpen(false)}>&times;</span>
            {submitted ? (
              <p className="success-message">Спасибо за заказ! Бронирование подтверждено.</p>
            ) : (
              <>
                <h3>Бронирование билета</h3>
                <form onSubmit={handleSubmit} className="ticket-form">
                  <label>
                    Тип места:
                    <select name="seatType" value={formData.seatType} onChange={handleChange}>
                      {seatTypes.map((type) => (
                        <option key={type.label} value={type.label}>
                          {type.label} ({type.priceMultiplier}x)
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Кол-во билетов:
                    <input
                      type="number"
                      name="tickets"
                      min="1"
                      max="10"
                      value={formData.tickets}
                      onChange={handleChange}
                      required
                    />
                  </label>
                  <p><strong>Сумма:</strong> {calculateTotal()} сом</p>
                  <button type="submit" className="submit-btn">Забронировать</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowDetails;
