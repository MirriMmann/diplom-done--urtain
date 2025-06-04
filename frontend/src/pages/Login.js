import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
  
      if (data.token) {
        localStorage.setItem("token", data.token); 
      } else {
        console.log("Токен не найден в ответе");
      }
  
      const userRole = data.role;  
      if (userRole === "admin") {
        navigate("/adminSicret"); 
      } else {
        navigate("/");  
      }
    } catch (err) {
      setError("Ошибка входа. Проверьте email и пароль.");
      console.error("Ошибка входа", err);
    }
  };
  

  return (
    <div className="login-page">
      <div className="form-container">
        <div className="form-content">
          <h2>Вход</h2>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleLogin}>
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
            <button type="submit">Войти</button>
          </form>
          <p>
            Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
          </p>
        </div>
        <div className="image-container">
          <img src="/img/LogIn-Ryo.jpg" alt="Login Illustration" />
        </div>
      </div>
    </div>
  );
};

export default Login;
