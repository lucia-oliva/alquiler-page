import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export const Hours = (props) => {
  Hours.propTypes = {
    cancha: PropTypes.number,
    fecha: PropTypes.string,
  };
  const [horariosBD, setHorariosBD] = useState([]);
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
    if (
      horariosBD.some(
        (element) => parseInt(element.hora_inicio.slice(0, 2)) === hour
      )
    ) {
      return "red";
    }
  };

  return (
    <div>
      <h2>
        Horarios para {fecha} - Cancha {cancha}
      </h2>

      <ul>
        {horariosFijos.map((hora, index) => (
          <li
            key={index}
            style={{
              backgroundColor: verificarDisponibilidad(hora),
              color: "black",
              listStyle: "none",
              padding: "10px",
              margin: "5px 0",
              cursor: "pointer",
            }}
            onClick={() => {
              console.log("Horario seleccionado: ", hora);
            }}
          >
            {`${hora}:00`}
          </li>
        ))}
      </ul>
    </div>
  );
};
