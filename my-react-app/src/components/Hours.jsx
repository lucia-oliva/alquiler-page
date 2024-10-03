import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export const Hours = (props) => {
  Hours.propTypes = {
    cancha: PropTypes.number,
    fecha: PropTypes.string,
  };
  //Creamos un user State, inicializamos la fecha en el dia de hoy.
  const [horariosBD, setHorariosBD] = useState([]);
  let cancha = props.cancha;
  let fecha = props.fecha;

  const horariosFijos = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  useEffect(() => {
    async function hora_inicio(fecha, cancha) {
      try {
        const response = await fetch("http://localhost:4000/getHorarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fecha,
            cancha,
          }),
        });
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setHorariosBD(data);
          return data;
        } else {
          throw new Error("Error en la petición");
        }
      } catch (err) {
        console.error("Error:", err);
      }
    }
    hora_inicio(fecha, cancha); //pasamos como argumento la fecha de hoy para traer horarios segun fecha.
  }, [fecha, cancha]);

  // Función para comprobar disponibilidad de horario
  const verificarDisponibilidad = (hour) => {
    return horariosBD.find(
      // horarioDB es un array de horarios se puede usar .find para buscar un horario y comparar
      (horario) => horario.hora_inicio.slice(0, 5) === hour
    )
      ? "red"
      : "white";
  };

  return (
    <div>
      <h2 style={{ color: "white" }}>
        Horarios para {fecha} - Cancha {cancha}
      </h2>

      {/*Input para seleccionar cancha*/}

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
            }}
          >
            {hora}
          </li>
        ))}
      </ul>
    </div>
  );
};
