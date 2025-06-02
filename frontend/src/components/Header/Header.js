import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Header.css';
import CreateShow from "../AdminSitt/CreateShow";
import SearchBar from "../Search/SearchBar";

const Header = () => {
  const navigate = useNavigate();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // <<<
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setUser({ name: data.name, role: data.role });
      } catch (error) {
        console.error("Ошибка при получении профиля пользователя:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleMyBookingsClick = () => {
    setIsMobileMenuOpen(false);
    navigate("/booked");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleToggleAccordion = () => setIsAccordionOpen((prev) => !prev);
  const handleCloseAccordion = () => setIsAccordionOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev); // <<<

  return (
    <>
      <header className="header">
        <div className="left-section">
          <div className="logo">
            <img src="/img/Secret-Ryo.jpg" alt="logo Illustration" />
          </div>
          {user && <span className="user-name">Здравствуй, {user.name}!</span>}
        </div>

        {/* Бургер для мобильных */}
        <button className="burger-icon" onClick={toggleMobileMenu}>
          ☰
        </button>

        {/* Навигация — десктоп */}
        <nav className="nav">
          {(user?.role === "creator" || user?.role === "admin") && (
            <button className="nav-button" onClick={handleToggleAccordion}>
              {isAccordionOpen ? "Скрыть форму" : "Добавить спектакль"}
            </button>
          )}
          <SearchBar />
          <button className="nav-button" onClick={handleMyBookingsClick}>Мои брони</button>
          <button className="nav-button" onClick={handleLogout}>Выйти</button>
        </nav>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            {(user?.role === "creator" || user?.role === "admin") && (
              <button className="nav-button" onClick={() => {
                handleToggleAccordion();
                setIsMobileMenuOpen(false);
              }}>
                {isAccordionOpen ? "Скрыть форму" : "Добавить спектакль"}
              </button>
            )}
            <SearchBar />
            <button className="nav-button" onClick={handleMyBookingsClick}>Мои брони</button>
            <button className="nav-button" onClick={handleLogout}>Выйти</button>
          </div>
        )}
      </header>

      {isAccordionOpen && <CreateShow onClose={handleCloseAccordion} />}
    </>
  );
};

export default Header;
