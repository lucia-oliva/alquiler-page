import { useAuth } from "../../utils/useAuth";
import { RentForm } from "./components/RentForm";
import { useState } from "react";
import "./rent.css";
export const Rent = () => {
  const { logout } = useAuth();
  const [cancha, setCancha] = useState(0);

  return (
    <div className="Rent-page">
      <div className="Header">
        <h1>Centro Deportivo CPCELR</h1>
        <p>Castro Barros 1102, La Rioja</p>
      </div>

      <div className="Form-container">
        <RentForm cancha={cancha} setCancha={setCancha} />
        <div className="Canchas">
          <h3>{cancha == 1 ? `Cancha de Padel` : `Cancha de Voley`}</h3>
          <p>
            {cancha == 1
              ? ` La cancha de pádel tiene dimensiones de 20 x 10 metros y está rodeada por paredes de vidrio y malla,
                lo que permite un juego dinámico y emocionante. La superficie de material ofrece un excelente agarre,
                 mientras que las líneas marcan las áreas de servicio.
                  Este espacio cerrado brinda un ambiente social perfecto para disfrutar del pádel,
                   independientemente de las condiciones externas.`
              : `La cancha de vóley,mide 18 x 9 metros y cuenta con una superficie de material sintético que
                garantiza un buen rendimiento. La red central se eleva a 2,43
                 metros para hombres y 2,24 metros para mujeres, desafiando a los jugadores 
                 a saltar y golpear con precisión.`}
          </p>
          <img
            id="Canchas-img"
            src={cancha == 1 ? `canchaPadel2.png` : `cancha_volley.jpg`}
            alt={cancha == 1 ? `Una Cancha de Padel` : `Una Cancha de Voley`}
          />
        </div>
      </div>

      <div className="Info">
        <div className="Services-container">
          <h3>Servicios</h3>
          <ul>
            <li>Wifi</li>
            <li>Vestuarios</li>
            <li>Parking Gratuito</li>
            <li>Salon</li>
            <li>Cocina</li>
            <li>Tribunas</li>
            <li>Iluminacion</li>
          </ul>
        </div>
        <div className="Horarios-container">
          <h4>Horarios de Atención</h4>
          <div className="Horarios">
            <ul>
              <li>Lunes</li>
              <li>09:00 - 18:00</li>
              <li>Martes</li>
              <li>09:00 - 18:00</li>
              <li>Miercoles</li>
              <li>09:00 - 18:00</li>
              <li>Jueves</li>
              <li>09:00 - 18:00</li>
              <li>Viernes</li>
              <li>09:00 - 18:00</li>
              <li>Sabado</li>
              <li>09:00 - 18:00</li>
              <li>Domingo</li>
              <li>09:00 - 18:00</li>
              <li>Festivos</li>
              <li>Cerrado</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
