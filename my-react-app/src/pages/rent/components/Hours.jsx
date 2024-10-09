import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Hours.css";

export const Hours = (props) => {
  Hours.propTypes = {
    cancha: PropTypes.number,
    fecha: PropTypes.string,
    rangoHorario: PropTypes.object,
    setRangoHorario: PropTypes.func,
  };

  const [horariosBD, setHorariosBD] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [horaElegida, setHoraElegida] = useState({});
  let rangoHorario = props.rangoHorario;
  let setRangoHorario = props.setRangoHorario;
  let cancha = props.cancha;
  let fecha = props.fecha;
  const horariosFijos = [];

  for (let i = 8; i <= 23; i++) {
    horariosFijos.push(i);
  }

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await fetch("http://localhost:3000/getHorarios", {
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
            className={
              `hour-buttons ` +
              (rangoHorario.start === hora ||
              rangoHorario.end === hora ||
              (hora > rangoHorario.start && hora < rangoHorario.end)
                ? "active"
                : "")
            }
            key={index}
            type="button"
            disabled={verificarDisponibilidad(hora)}
            onClick={() => handleModal(hora)}
          >
            <p>{hora}</p>
          </button>
        </div>
      ))}
      <div className={`modal ${isOpen ? "open" : ""}`}>
        <button
          className="close-button"
          type="button"
          onClick={() => setIsOpen(!isOpen) || setRangoHorario({})}
        >
          X
        </button>
        <div className="modal-content">
          <p className="modal-text">Horarios disponible:</p>
          <div className="modal-buttons-container">
            {verificarSiguientesHoras(horaElegida).map((hour) => (
              <button
                type="button"
                key={hour}
                onClick={() =>
                  setRangoHorario({ start: horaElegida, end: hour }) ||
                  setIsOpen(!isOpen)
                }
              >
                <p className="hour-text">
                  {horaElegida ? `${horaElegida}:00 a ${hour}:00` : ""}
                </p>
                <p className="price-text">${(hour - horaElegida) * 2000} </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
