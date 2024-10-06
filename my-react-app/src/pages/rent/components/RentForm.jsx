// src/pages/Rent.jsx

import { useState } from "react";
import PropTypes from "prop-types";
import { Hours } from "./Hours";

export const RentForm = (props) => {
  RentForm.propTypes = {
    cancha: PropTypes.number,
    setCancha: PropTypes.func,
  };
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [rangoHorario, setRangoHorario] = useState({ start: "", end: "" });
  const [pdfFile, setPdfFile] = useState(null); // Nuevo estado para el archivo PDF
  let cancha = props.cancha;
  let setCancha = props.setCancha;

  const email = JSON.parse(window.localStorage.getItem("user"))?.email;
  if (!email) {
    window.location.href = "/login";
  }

  const handleSubmit = (event) => {
    console.log("submit", email, cancha, rangoHorario);

    event.preventDefault();

    // Crear FormData para enviar tanto los campos como el archivo PDF
    const formData = new FormData();
    formData.append("email", email);
    formData.append("cancha_id", cancha);
    formData.append("horario_inicio", rangoHorario.start);
    formData.append("horario_fin", rangoHorario.end);

    if (pdfFile) {
      formData.append("comprobante", pdfFile); // Añadir el archivo PDF al formData
    }

    // Realizar el fetch utilizando FormData en lugar de JSON
    fetch("http://localhost:3000/reserve", {
      method: "POST",
      body: formData, // Enviar FormData en lugar de JSON
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
      })
      .catch((error) => {
        console.error("Error creating reservation:", error);
      });
  };

  return (
    <div className="rent-page">
      <form onSubmit={(event) => handleSubmit(event)} method="post">
        <select
          value={cancha}
          onChange={(e) => setCancha(Number(e.target.value))}
          style={{}}
        >
          <option value="0" hidden>
            Selecciona una cancha
          </option>
          <option value="1">Cancha de Padel</option>
          <option value="2">Cancha de Volley</option>
        </select>

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          style={{ marginBottom: "20px", paddingBottom: "10px" }}
        />

        {cancha && fecha ? (
          <Hours
            cancha={cancha}
            fecha={fecha}
            horaElegida={rangoHorario}
            setHoraElegida={setRangoHorario}
          />
        ) : (
          <p>Por favor, seleccione la cancha y la fecha</p>
        )}

        <label>Subir PDF (opcional):</label>
        <input
          type="file"
          accept="application/pdf" // Asegura que solo se puedan seleccionar archivos PDF
          onChange={(e) => setPdfFile(e.target.files[0])} // Guardar el archivo PDF seleccionado
        />

        <button type="submit">Reservar</button>
      </form>
    </div>
  );
};
