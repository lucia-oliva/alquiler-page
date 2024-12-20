import { useEffect, useState } from "react";
import './reports.css';
import { Doughnut } from "react-chartjs-2";
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LinearScale,
  BarElement,
  Title,
  CategoryScale
} from "chart.js";

// Registra los elementos
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, CategoryScale, LinearScale, BarElement, Title);

const Reports = () => {
  const [reservas, setReservas] = useState([]);
  const [confirmados, setConfirmados] = useState(0);
  const [pendientes, setPendientes] = useState(0);
  const [dataPorDia, setDataPorDia] = useState(null);
  const [dataPorHora, setDataPorHora] = useState(null);
  const [dataPorDiaMesActual, setDataPorDiaMesActual] = useState(null);
  const [dataPorHoraMesActual, setDataPorHoraMesActual] = useState(null);
  const [mesActual, setMesActual] = useState(new Date().getMonth());
  const [anioActual, setAnioActual] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch("http://localhost:3000/getReservas");
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        setReservas(data.reservas);

        // Calcula confirmados y pendientes
        const pagosConfirmados = data.reservas.filter(r => r.pago_total).length;
        const pagosPendientes = data.reservas.length - pagosConfirmados;

        setConfirmados(pagosConfirmados);
        setPendientes(pagosPendientes);

        // Mapea las fechas de reserva a días de la semana para todas las reservas
        const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const conteoPorDia = Array(7).fill(0);

        data.reservas.forEach(reserva => {
          if (reserva.fecha) {
            const fecha = new Date(reserva.fecha);
            const diaSemana = fecha.getUTCDay();
            conteoPorDia[diaSemana]++;
          }
        });

        // Configura los datos del gráfico para días históricos
        setDataPorDia({
          labels: diasSemana,
          datasets: [
            {
              label: 'Reservas por Día de la Semana (Histórico)',
              data: conteoPorDia,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

        // Conteo de reservas por horario para todas las reservas
        const conteoPorHora = Array(16).fill(0); // Desde 8:00 hasta 23:00

        data.reservas.forEach(reserva => {
          if (reserva.hora_inicio) {
            const hora = parseInt(reserva.hora_inicio.split(':')[0], 10); // Obtener la hora
            if (hora >= 8 && hora <= 23) {
              conteoPorHora[hora - 8]++; // Resta 8 para que el índice empiece en 0
            }
          }
        });

        // Configura los datos del gráfico para horas históricas
        const horasLabels = Array.from({ length: 16 }, (_, i) => `${i + 8}:00`);
        setDataPorHora({
          labels: horasLabels,
          datasets: [
            {
              label: 'Reservas por Horario (Histórico)',
              data: conteoPorHora,
              backgroundColor: 'rgba(255, 206, 86, 0.6)',
              borderColor: 'rgba(255, 206, 86, 1)',
              borderWidth: 1,
            },
          ],
        });

        // Filtra las reservas del mes actual
        const reservasMesActual = data.reservas.filter(reserva => {
          const fechaReserva = new Date(reserva.fecha);
          return fechaReserva.getMonth() === mesActual && fechaReserva.getFullYear() === anioActual;
        });

        // Mapea las fechas de reserva a días de la semana para el mes actual
        const conteoPorDiaMesActual = Array(7).fill(0);
        reservasMesActual.forEach(reserva => {
          if (reserva.fecha) {
            const fecha = new Date(reserva.fecha);
            const diaSemana = fecha.getUTCDay();
            conteoPorDiaMesActual[diaSemana]++;
          }
        });

        // Configura los datos del gráfico para días del mes actual
        setDataPorDiaMesActual({
          labels: diasSemana,
          datasets: [
            {
              label: 'Reservas por Día de la Semana (Mes Actual)',
              data: conteoPorDiaMesActual,
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        });

        // Conteo de reservas por horario para el mes actual
        const conteoPorHoraMesActual = Array(16).fill(0);

        reservasMesActual.forEach(reserva => {
          if (reserva.hora_inicio) {
            const hora = parseInt(reserva.hora_inicio.split(':')[0], 10); // Obtener la hora
            if (hora >= 8 && hora <= 23) {
              conteoPorHoraMesActual[hora - 8]++; // Resta 8 para que el índice empiece en 0
            }
          }
        });

        // Configura los datos del gráfico para horarios del mes actual
        setDataPorHoraMesActual({
          labels: horasLabels,
          datasets: [
            {
              label: 'Reservas por Horario (Mes Actual)',
              data: conteoPorHoraMesActual,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        });

      } catch (error) {
        console.error("Error al obtener los datos de reservas:", error);
      }
    };

    fetchReservas();
  }, [mesActual, anioActual]);

  const totalReservas = confirmados + pendientes;
  const data = {
    labels: [
      `Pagos Confirmados: ${((confirmados / totalReservas) * 100).toFixed(2)}%`,
      `Pagos Pendientes: ${((pendientes / totalReservas) * 100).toFixed(2)}%`
    ],
    datasets: [
      {
        label: "Reservas",
        data: [confirmados, pendientes],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36F8EB", "#FF6384"],
      },
    ],
  };

  return (
    <div className="main-contenedor">
      <div className="reporte">
        <h3>Proporción de Pagos Confirmados y Pendientes</h3>
        <Doughnut data={data} />
      </div>
      <div className="reporte">
        {dataPorDia ? (
          <Bar
            data={dataPorDia}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Reservas por Día de la Semana (Histórico)' },
              },
            }}
          />
        ) : (
          <p>Cargando gráfico...</p>
        )}
         {dataPorHora ? (
          <Bar
            data={dataPorHora}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Horarios Más Rentados (Histórico)' },
              },
            }}
          />
        ) : (
          <p>Cargando gráfico de horarios...</p>
        )}
      </div>
      <div className="reporte">
        {dataPorDiaMesActual ? (
          <Bar
            data={dataPorDiaMesActual}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Reservas por Día de la Semana (Mes Actual)' },
              },
            }}
          />
        ) : (
          <p>Cargando gráfico de días del mes actual...</p>
        )}
        {dataPorHoraMesActual ? (
          <Bar
            data={dataPorHoraMesActual}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Horarios Más Rentados (Mes Actual)' },
              },
            }}
          />
        ) : (
          <p>Cargando gráfico de horarios del mes actual...</p>
        )}
      </div>
    
    </div>
  );
};

export default Reports;

