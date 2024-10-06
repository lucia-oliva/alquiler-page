import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Hours.css";

export const Hours = (props) => {
  Hours.propTypes = {
    cancha: PropTypes.number,
    fecha: PropTypes.string,
    horaElegida: PropTypes.object,
    setHoraElegida: PropTypes.func,
  };

  const [horariosBD, setHorariosBD] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [horaElegida, setHoraElegida] = useState({});
  let cancha = props.cancha;
  let fecha = props.fecha;
  const horariosFijos = [];

  for (let i = 8; i <= 23; i++) {
    horariosFijos.push(i);
  }

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await fetch("http://localhost:4000/getHorarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fecha, cancha }),
        });

        if (!response.ok) {
          throw new Error("Error en la petición");
        }
        const data = await response.json();
        setHorariosBD(data);
        return data;
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchHorarios();
  }, [fecha, cancha]);

  // Función para comprobar disponibilidad de horario
  const verificarDisponibilidad = (hour) => {
    return horariosBD.some((horario) => {
      const [initialHour] = horario.hora_inicio.split(":").map(Number);
      const [finalHour] = horario.hora_fin.split(":").map(Number);
      return hour >= initialHour && hour <= finalHour;
    });
  };

  const handleModal = (hour) => {
    setHoraElegida(hour);
    setIsOpen(!isOpen);
  };

  function verificarSiguientesHoras(hour) {
    const nextHours = [hour + 1, hour + 2, hour + 3];
    const availableHours = [];
    for (const nextHour of nextHours) {
      if (!verificarDisponibilidad(nextHour) || nextHour === hour + 1) {
        availableHours.push(nextHour);
      } else {
        return availableHours;
      }
    }
    return availableHours;
  }

  return (
    <div className="hours-container">
      {horariosFijos.map((hora, index) => (
        <div className="buttons-container" key={index}>
          <button
            className={`hour-buttons`}
            key={index}
            type="button"
            disabled={verificarDisponibilidad(hora)}
            onClick={() => handleModal(hora)}
          >
            {" "}
            {hora}:00
          </button>
        </div>
      ))}
      <div className={`modal ${isOpen ? "open" : ""}`}>
        <div className="modal-content">
          <p>
            <b>Horario disponible:</b>
            {verificarSiguientesHoras(horaElegida).map((hour) => (
              <button key={hour} onClick={() => setHoraElegida(hour)}>
                {hour}
              </button>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
};
