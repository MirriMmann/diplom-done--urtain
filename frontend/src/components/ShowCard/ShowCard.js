// ShowCard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ShowCardH.css";

const ShowCard = ({ show }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/shows/${show._id}`);
  };

  return (
    <li className="show-card" onClick={handleClick}>
      {show.poster && (
        <img
          src={`${process.env.REACT_APP_API_URL}${show.poster}`}
          alt={show.title}
          className="show-image"
        />
      )}
      <h3>{show.title}</h3>
    </li>
  );
};

export default ShowCard;
