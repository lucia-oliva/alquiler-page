// src/pages/Login.jsx
import { useEffect,useState } from "react";
import { useAuth } from "../utils/useAuth";
import "./login.css";
import { Alert } from "@mui/material";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useAuth();
  //estado para las alertas
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  if (user) {
    window.location.href = "/reservation";
  }

  //actualizar la alerta despues de 5 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

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
        //agrego el valor admin
        login({ email, token: data.token,admin:data.admin });
      } else {
        setMessage("Email o Contraseña invalidas");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Hubo un error: " + error.message);
      setMessageType("error");
      console.log(error);
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

            {message && (
              <Alert severity={messageType} onClose={() => setMessage("")}>
                {message}
              </Alert>
            )}
          <button className="boton-login" type="submit">
          Iniciar Sesion
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
