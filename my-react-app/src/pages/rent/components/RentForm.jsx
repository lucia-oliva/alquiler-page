// src/pages/Rent.jsx

import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Hours } from "./Hours";
import "./RentForm.css";
import { Alert } from "@mui/material";

export const RentForm = (props) => {
  RentForm.propTypes = {
    cancha: PropTypes.number,
    setCancha: PropTypes.func,
  };
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [rangoHorario, setRangoHorario] = useState({ start: "", end: "" });
  const [pdfFile, setPdfFile] = useState(null); // Nuevo estado para el archivo PDF
  const [pago_total, setPago_total] = useState(null); //Estado para la nueva forma de pago
  const [valorReserva, setValorReserva] = useState(0);
  let cancha = props.cancha;
  let setCancha = props.setCancha;
  //estado para las alertas
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

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


  const email = JSON.parse(window.localStorage.getItem("user"))?.email;

  const handleSubmit = (event) => {
    console.log("submit", email, cancha, rangoHorario, pago_total);

    event.preventDefault();

    //validar si el archivo fue subido.
    if(!pdfFile){
      setMessage("Por favor, adjuntar un comprobante de pago");
      setMessageType("error");
      return;
    }

    if(pdfFile && pdfFile.type !== "application/pdf"){
      setMessage("El archivo debe ser un PDF");
      setMessageType("error");
      return;
    }

    let pagoParcial = pago_total == "pago_completo";
    // Crear FormData para enviar tanto los campos como el archivo PDF
    const formData = new FormData();
    formData.append("email", email);
    formData.append("cancha_id", cancha);
    formData.append("horario_inicio", rangoHorario.start);
    formData.append("horario_fin", rangoHorario.end);
    formData.append("fecha", fecha); 
    formData.append("pagoParcial", pagoParcial); 

    console.log(pagoParcial);

    if (pdfFile) {
      formData.append("comprobante", pdfFile); // Añadir el archivo PDF al formData
    }

    // Realizar el fetch utilizando FormData en lugar de JSON
    fetch("http://localhost:3000/reserve", {
      method: "POST",
      body: formData, // Enviar FormData en lugar de JSON
    })
      .then((response) => {
        if(response.ok){
          setMessage("Reserva realizada con éxito");
          setMessageType("success");
        }else{
          setMessage("Hubo un error al realizar la reserva");
          setMessageType("error");
        }
      }).catch((err) => {
        setMessage("Hubo un error en la reserva" + err.message);
        setMessageType("error");
        console.error(err);
      });
    };
      

  return (
    <div className="rent-form-container">
      <form
        onSubmit={(event) => handleSubmit(event)}
        method="post"
        className="rent-form"
        noValidate
      >
        <div className="select-container">
          <select
            value={cancha}
            onChange={(e) =>
              setCancha(Number(e.target.value)) ||
              setRangoHorario({ start: "", end: "" })
            }
            id="cancha-select"
          >
            <option value="0" hidden>
              Selecciona una cancha
            </option>
            <option value="1">Cancha de Padel</option>
            <option value="2">Cancha de Volley</option>
          </select>

          <input
            id="date-input"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        {cancha && fecha ? (
          <Hours
            cancha={cancha}
            fecha={fecha}
            rangoHorario={rangoHorario}
            setRangoHorario={setRangoHorario}
            setValorReserva={setValorReserva}
          />
        ) : (
          <p className="not-selected">Selecciona una cancha y una fecha </p>
        )}

        {rangoHorario.end ? (
        <>
          <div className="payment-method-container">
            <h3>Seleccionar Forma de Pago</h3>
            <select
              
              value={pago_total}


              onChange={(e) => setPago_total(e.target.value)}
              id="payment-method-select"
            >
              <option value="" hidden>
                Selecciona una Forma de Pago
              </option>
              <option value="pago_parcial">Seña</option>
              <option value="pago_completo">Pago Total</option>
            </select>
          </div>

          {pago_total && (
            
            <div className="pdf-container">
            
            
            <h3>Subir Comprobante de pago:</h3>
            <p>
              {" "}
              El pago es realizado unicamente mediante transferencia.
              Si se realiza una seña, se debe abonar el 50% del valor de la reserva. <br />{" "}
              Alias : cpecelr.mp CBU: 0000000000000000000 CUIL: 00000000-0
            </p>

            {/*Mostrar Informacion segun el tipo de pago*/}
            {pago_total === "pago_parcial" &&(
              <div className="info_pagos">
                <p className="valor_reserva_t">Valor Reserva: ${valorReserva}</p>
                <p className="valor_reserva_p">Valor Seña: ${valorReserva / 2}</p>
              </div>
            )}
            {pago_total === "pago_completo" && (
              <div className="info_pagos">
                <p className="valor_reserva_t">Valor Reserva: ${valorReserva}</p>
              </div>
            )}
            <input
              type="file"
              id="pdf-file"
              accept="application/pdf"// Asegura que solo se puedan seleccionar archivos PDF
              required // Asegura que sea obligatorio subir los comprobantes de pago. 
              
              onChange={(e) => setPdfFile(e.target.files[0])} // Guardar el archivo PDF seleccionado
            />
            
            {message && (
              <Alert severity={messageType} onClose={() => setMessage("")}>
                {message}
              </Alert>
            )}

            <button className="button-submit" type="submit">
              Reservar
            </button>

          
          </div>
        )}
        </>
        ):(
          <b></b>
        )}
      </form>
    </div>
  );
};
