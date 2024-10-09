// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../utils/useAuth";
import "./login.css";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();

  if (user) {
    window.location.href = "/reservation";
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/loginUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        login({ email, token: data.token });
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <label>Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="boton-login" type="submit">
            Login
          </button>
        </form>
      </div>
      <div className="register-container">
        <p className="register-text">¿No tienes una cuenta?</p>
        <a className="register-link" href="/register">
          Registrate aqui
        </a>
      </div>
    </div>
  );
};
