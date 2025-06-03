import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      setMessage("Регистрация успешна! Сейчас вы будете перенаправлены для подтверждения.");
      setError("");
      setTimeout(() => {
        setMessage("");
        navigate("/login");
      }, 3001);
    } catch (err) {
      setError("Ошибка регистрации. Возможно, email уже используется.");
      setMessage("");
    }
  };

  return (
    <div className="register-page">
      <div className="form-container">
        <div className="form-content">
          <h2>Регистрация</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={15}
              className="input-field"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
            <button type="submit">Зарегистрироваться</button>
          </form>
          {message && <div className="toast toast-bottom">{message}</div>}
          <p>
            Уже есть аккаунт? <Link to="/login">Войдите</Link>
          </p>
        </div>
        <div className="image-container">
          <img src="/img/SignIn-Yamada.jpg" alt="Register Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Register;
