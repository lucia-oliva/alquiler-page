import { useEffect, useState } from "react";
import "./admin.css";
import { Alert } from "@mui/material";
//import { useAuth } from "../utils/useAuth";

const AdminPage = () => {
  const [reservas, setReservas] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const [filtroCancha, setFiltroCancha] = useState(null);
  //filtro para ordenar por antiguedad.
  const [filtroFecha, setFiltroFecha] = useState(null);
  const [filtroPago, setFiltroPago] = useState(null);
  const [filtroBusquedaFecha, setFiltroBusquedaFecha] = useState(null);
  //estado para las alertas
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  
  //actualizar la alerta despues de 2 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  // Cargar las reservas al cargar la página
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch("http://localhost:3000/getReservas");
        const data = await response.json();
        setReservas(data.reservas); // Asegúrate de acceder a 'data.reservas'
      } catch (error) {
        setMessage("Error al cargar las reservas: " + error);
        setMessageType("error");
      }
    };

    fetchReservas();
  }, []);

  // Función para formatear la fecha en DD-MM-YY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  // Función para mostrar comprobante
  const mostrarComprobante = async (idReserva) => {
    try {
      const response = await fetch(
        `http://localhost:3000/reservas/${idReserva}/comprobante`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      setMessage("Error al obtener el comprobante: " + error);
      setMessageType("error");
    }
  };

  // Función para confirmar pago
  const confirmarPago = async (idReserva) => {
    const pago_total = true; 

    try {
      const response = await fetch(
        `http://localhost:3000/reservas/${idReserva}/confirmarPago`,
        {
          method: "PUT", 
          headers: {
            "Content-Type": "application/json", 
          },
          body: JSON.stringify({ pago_total }), // Enviar el total de pago en el cuerpo
        }
      );

      if (response.ok) {
        
        setMessage("Pago confirmado correctamente");
        setMessageType("success");
        // Actualiza la lista de reservas para reflejar el cambio
        setReservas((prevReservas) =>
          prevReservas.map((reserva) =>
            reserva.id === idReserva
              ? { ...reserva, pago_total: true }
              : reserva
          )
        );
      } else {
        setMessage("Error al confirmar el pago");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error al confirmar el pago" + error.message);
      setMessageType("error");
    }
  };

  // Función para cancelar reserva
  const cancelarReserva = async (idReserva) => {
    try {
      const response = await fetch(
        `http://localhost:3000/reservas/${idReserva}/cancelar`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setMessage("Reserva cancelada correctamente");
        setMessageType("success");
        // Remover la reserva de la lista de reservas
        setReservas((prevReservas) =>
          prevReservas.filter((reserva) => reserva.id !== idReserva)
        );

        window.location.reload();
      } else {
        setMessage("Error al cancelar la reserva");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Error al cancelar la reserva" + error.message);
      setMessageType("error");
    }
  };

  // Handle a reservation being clicked
  const handleReservaClick = async (reservaId) => {
    const selectedReserva = reservas.find(
      (reserva) => reserva.id === reservaId
    );
    setReservaSeleccionada(selectedReserva);

    setTimeout(() => {
      const aside = document.querySelector("aside");
      if (!aside.classList.contains("open")) {
        aside.classList.add("open");
      }
    }, 100);
  };

  // Cerrar la información de la reserva seleccionada
  const handleClose = () => {
    const aside = document.querySelector("aside");
    if (aside.classList.contains("open")) {
      aside.classList.remove("open");
    }

    setTimeout(() => {
      setReservaSeleccionada(null);
    }, 400);
  };

  // Filtrar las reservas por cancha
  const handleFilterCancha = (event) => {
    const selectedCancha = event.target.value;
    setFiltroCancha(selectedCancha);
  };

  // Ordenar las reservas por antiguedad
  const handleFilterFecha = (event) => {
    const selectedOrden = event.target.value;
    setFiltroFecha(selectedOrden);
  }

//Ordenar las reservas por pago
const handleFilterPago = (event) => {
    const selectedPago = event.target.value;
    setFiltroPago(selectedPago);
}


  return (
    

    <div className="admin-page">
      <main className="admin-content">
      {message && (
              <Alert className="alerta" severity={messageType} onClose={() => setMessage("")}>
                {message}
              </Alert>
            )}

        <div className="reservas-header">
          <h2>Reservas</h2>
          <div className="reservas-header-filtros">
          <fieldset>
          <input 
          type="text" 
          id="filtro-fechas"
          placeholder="Buscar por fecha..." 
          value={filtroBusquedaFecha}
          onChange={(e) => setFiltroBusquedaFecha(e.target.value)} 
          />
          </fieldset>
          <select
            name=" filtro-canchas"
            onChange={handleFilterCancha}
            defaultValue={""}
            id="filtro-canchas"
          >
            <option value="">Filtrar por cancha</option>
            <option value="1">Padel</option>
            <option value="2">Volley</option>
          </select>
          <select
            name=" filtro-Fechas"
            onChange={handleFilterFecha}
            defaultValue={""}
            id="filtro-Fechas"
          >
            <option value="">Filtrar por Antiguedad</option>
            <option value="1">Mas Antiguo</option>
            <option value="2">Mas Reciente</option>
          </select>
          <select
            name=" filtro-Pago"
            onChange={handleFilterPago}
            defaultValue={""}
            id="filtro-Pago"
          >
            <option value="">Filtrar por Pago</option>
            <option value="1">Confirmado</option>
            <option value="2">Pendiente</option>
          </select>

          </div>
        </div>
        

        {!reservas.length ? (
          <p>No hay reservas disponibles.</p>
        ) : (
          <table className="reservas-table">
            <thead className="reservas-table-header">
              <tr>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Tipo de cancha</th>
                <th>Pago</th>
              </tr>
            </thead>
            <tbody>
              {reservas
                .filter(
                  (reserva) => {

                    const reservaFecha = formatDate(reserva.fecha);

                    const cumpleFiltroCancha = reserva.cancha_id === filtroCancha || !filtroCancha;

                    const cumpleFiltroPago = 
                    filtroPago === null ||
                    filtroPago === '' || 
                    (filtroPago === "1" && reserva.pago_total) ||
                    (filtroPago === "2" && !reserva.pago_total)

                    const cumpleFiltroBusquedaFecha = reservaFecha.includes(filtroBusquedaFecha) || !filtroBusquedaFecha;

                    return cumpleFiltroCancha && cumpleFiltroPago && cumpleFiltroBusquedaFecha; 

                    //(reserva.cancha_id === filtroCancha || !filtroCancha) &&
                  //(!filtroPago ||   // mostrar todos
                    //(filtroPago === "1" && reserva. pago_total) || //pago confirmado
                    //(filtroPago === "2" && !reserva.pago_total)) //pago pendiente
                })
                .sort(  (a, b) => {
                  const dateA = new Date(a.fecha);
                  const dateB = new Date(b.fecha);
                  
                  if(filtroFecha === "2"){
                    return dateB - dateA;  //mas reciente
                  }else if(filtroFecha === "1"){
                    return dateA - dateB; //mas antiguo
                  }else{
                    return 0;  // para que no se ordenen los objetos de manera diferente según el filtro
                  }
                }
              ).map((reserva) => (
                  <tr
                    className={
                      reservaSeleccionada?.id === reserva.id ? "selected" : ""
                    }
                    key={reserva.id}
                    onClick={() => handleReservaClick(reserva.id)}
                  >
                    <td>{formatDate(reserva.fecha)}</td>
                    <td>
                      {reserva.hora_inicio.slice(0, 5) +
                        " - " +
                        reserva.hora_fin.slice(0, 5)}
                    </td>
                    <td style={{ textTransform: "capitalize" }}>
                      {reserva.cancha}
                    </td>
                    <td className={reserva.pago_total ? "green" : "Red"}>
                      <p> {reserva.pago_total ? "Confirmado" : "Pendiente"}</p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </main>
      {reservaSeleccionada && (
        <aside className="aside">
          <div className="aside-header">
            <h3>Detalles de la Reserva</h3>
            <button className="close-btn" onClick={handleClose}>
              X
            </button>
          </div>
          <div className="aside-user">
            <p>
              {reservaSeleccionada.nombre} {reservaSeleccionada.apellido}
            </p>
            <p> {reservaSeleccionada.usuario_email}</p>
          </div>
          <div className="divider"></div>
          <h4> Detalles</h4>
          <div className="aside-details">
            <p>
              <strong>Fecha</strong>: {""}
              {formatDate(reservaSeleccionada.fecha).toString()}
            </p>
            <p>
              <strong>Horario</strong>: {""}{" "}
              {reservaSeleccionada.hora_inicio.slice(0, 5)} -{" "}
              {reservaSeleccionada.hora_fin.slice(0, 5)}
            </p>
            <p>
              <strong>Tipo de cancha</strong>:
            </p>
            <p>{reservaSeleccionada.cancha}</p>
            <p>
              <strong>Pago Confirmado</strong>:
            </p>
            <p className={reservaSeleccionada.pago_total ? "green" : "Red"}>
              {reservaSeleccionada.pago_total ? "Confirmado" : "Pendiente"}
            </p>
          </div>
          <div className="divider"></div>
          <div className="aside-buttons">
            <button
              id="comprobante"
              onClick={() => mostrarComprobante(reservaSeleccionada.id)}
            >
              Mostrar Comprobante
            </button>
            {!reservaSeleccionada.pago_total && (
              <button
                id="confirmar"
                onClick={() => confirmarPago(reservaSeleccionada.id)}
              >
                Confirmar Pago
              </button>
            )}

            <button
              id="cancelar"
              onClick={() => cancelarReserva(reservaSeleccionada.id)}
            >
              Cancelar Reserva
            </button>
          </div>
        </aside>
      )}
    </div>
  );
};

export default AdminPage;
