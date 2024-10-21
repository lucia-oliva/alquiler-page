import { useEffect, useState } from "react";
import { useAuth } from "../utils/useAuth";

const AdminPage = () => {
  const [reservas, setReservas] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  const { user } = useAuth(); // Supongo que necesitas saber si el admin está autenticado

  // Cargar las reservas al cargar la página
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch("http://localhost:3000/getReservas");
        const data = await response.json();
        setReservas(data.reservas); // Asegúrate de acceder a 'data.reservas'
      } catch (error) {
        console.error("Error al obtener las reservas:", error);
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
      const response = await fetch(`http://localhost:3000/reservas/${idReserva}/comprobante`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Error al obtener el comprobante:", error);
    }
  };

  // Función para confirmar pago
  const confirmarPago = async (idReserva) => {
    const pago_total = true; // Ajusta este valor según la lógica de tu aplicación
  
    try {
      const response = await fetch(`http://localhost:3000/reservas/${idReserva}/confirmarPago`, {
        method: "PUT", // Cambiado a PUT
        headers: {
          "Content-Type": "application/json", // Asegúrate de especificar el tipo de contenido
        },
        body: JSON.stringify({ pago_total }), // Enviar el total de pago en el cuerpo
      });
  
      if (response.ok) {
        alert("Pago confirmado correctamente");
        // Actualiza la lista de reservas para reflejar el cambio
        setReservas((prevReservas) =>
          prevReservas.map((reserva) =>
            reserva.id === idReserva ? { ...reserva, pago_total: true } : reserva
          )
        );
      } else {
        console.error("Error al confirmar el pago");
      }
    } catch (error) {
      console.error("Error al confirmar el pago:", error);
    }
  };

  // Función para cancelar reserva
  const cancelarReserva = async (idReserva) => {
    try {
      const response = await fetch(`http://localhost:3000/reservas/${idReserva}/cancelar`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Reserva cancelada correctamente");
        // Remover la reserva de la lista de reservas
        setReservas((prevReservas) => prevReservas.filter((reserva) => reserva.id !== idReserva));
      } else {
        console.error("Error al cancelar la reserva");
      }
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
    }
  };

  // Función para manejar la selección de una reserva
  const handleReservaClick = async (idReserva) => {
    const reserva = reservas.find((res) => res.id === idReserva);
    setReservaSeleccionada(reserva);
  };

  // Cerrar la información de la reserva seleccionada
  const handleClose = () => {
    setReservaSeleccionada(null);
  };

  return (
    <div className="admin-page">
      <h2>Reservas</h2>
      {reservas.length === 0 ? (
        <p>No hay reservas disponibles.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Cancha</th>
              <th>Fecha</th>
              <th>Pago Confirmado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id} onClick={() => handleReservaClick(reserva.id)} style={{ cursor: 'pointer' }}>
                <td>{reserva.cancha}</td>
                <td>{formatDate(reserva.fecha)}</td>
                <td>{reserva.pago_total ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Mostrar información detallada de la reserva seleccionada */}
      {reservaSeleccionada && (
        <div className="reserva-detalles">
          <h3>Detalles de la Reserva</h3>
          <p><strong>Cancha:</strong> {reservaSeleccionada.cancha}</p>
          <p><strong>Fecha:</strong> {formatDate(reservaSeleccionada.fecha)}</p>
          <p><strong>Correo del Usuario:</strong> {reservaSeleccionada.usuario_email}</p>
          <p><strong>Nombre:</strong> {reservaSeleccionada.nombre}</p>
          <p><strong>Apellido:</strong> {reservaSeleccionada.apellido}</p>
          <p><strong>Pago Confirmado:</strong> {reservaSeleccionada.pago_total ? "Sí" : "No"}</p>
          <div>
            <button onClick={() => mostrarComprobante(reservaSeleccionada.id)}>Mostrar Comprobante</button>
            <button onClick={() => confirmarPago(reservaSeleccionada.id)}>Confirmar Pago</button>
            <button onClick={() => cancelarReserva(reservaSeleccionada.id)}>Cancelar Reserva</button>
          </div>
          <button onClick={handleClose}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;