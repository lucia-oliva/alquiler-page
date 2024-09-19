import "./register.css";
import { useEffect, useState } from "react";
import { Alert } from "@mui/material";

function Register(params) {
  //aplicacion de use state
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    asociado: false,
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (passwordError) {
      const timer = setTimeout(() => {
        setPasswordError("");
      }, 3000); // 5 segundos

      return () => clearTimeout(timer); // Limpiar el temporizador si el componente se desmonta o el error cambia
    }
  }, [passwordError]);

  //funcion que detecta cambios en los campos
  const onChange = (e) => {
    setFormData((prev) => {
      let helper = { ...prev };
      helper[`${e.target.name}`] = e.target.value;

      return helper;
    });
  };

  //funcion de envio de los datos

  const envio = async (e) => {
    e.preventDefault();
    const {
      nombre,
      apellido,
      telefono,
      email,
      password,
      confirmPassword,
      asociado,
    } = formData;

    if (password !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setMessage("");
    setPasswordError("");
    setMessageType("");

    try {
      const response = await fetch("http://localhost:4000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          apellido,
          telefono,
          email,
          password,
          asociado,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessageType("success");
        setMessage("Registro exitoso");
      } else {
        setMessageType("error");
        setMessage(data.message || "Error en el registro");
      }
    } catch (error) {
      setMessageType("error");
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <form onSubmit={envio}>
        <div className="titulo">
          <h2>Cree una nueva cuenta</h2>
        </div>
        <div className="alertas">
          {message && (
            <Alert variant="filled" severity={messageType}>
              {message}
            </Alert>
          )}
          {passwordError && (
            <Alert variant="filled" severity="error">
              {passwordError}
            </Alert>
          )}
        </div>

        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          required
          value={formData.nombre}
          onChange={onChange}
        />

        <label htmlFor="apellido">Apellido:</label>
        <input
          type="text"
          id="apellido"
          name="apellido"
          required
          value={formData.apellido}
          onChange={onChange}
        />

        <label htmlFor="telefono">Telefono:</label>
        <input
          type="tel"
          id="telefono"
          name="telefono"
          required
          value={formData.telefono}
          onChange={onChange}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={onChange}
        />

        <div className="asociado-check">
          <label htmlFor="asociado">¿Es asociado CPCE?:</label>
          <input
            type="checkbox"
            id="asociado"
            name="asociado"
            checked={formData.asociado}
            onChange={onChange}
            value={formData.asociado}
          />
        </div>

        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={formData.password}
          onChange={onChange}
        />

        <label htmlFor="confirmPassword">Confirmar Contraseña: </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
          value={formData.confirmPassword}
          onChange={onChange}
        />

        <input
          type="submit"
          id="submit"
          value={loading ? "Registrando..." : "Registrarse"}
          disabled={loading}
        />
      </form>
      <div className="ingresar-link">
        <p>
          ¿Ya tienes una cuenta? <a href="/login">Ingresa aqui.</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
