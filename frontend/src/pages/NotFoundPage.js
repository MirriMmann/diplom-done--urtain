import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.subtitle}>Страница не найдена</p>
      <Link to="/Login" style={styles.link}>На страницу входа</Link>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "10vh",
    padding: "20px",
  },
  title: {
    fontSize: "72px",
    marginBottom: "20px",
  },
  subtitle: {
    fontSize: "24px",
    marginBottom: "30px",
  },
  link: {
    fontSize: "18px",
    color: "#007bff",
    textDecoration: "none",
  },
};

export default NotFoundPage;
