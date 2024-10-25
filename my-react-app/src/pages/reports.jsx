import  { useEffect, useState } from "react";
import './reports.css'
import { Doughnut } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Registra los elementos que necesitas
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Reports = () => {
  const [reservas, setReservas] = useState([]);
  const [confirmados, setConfirmados] = useState(0);
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await fetch("http://localhost:3000/getReservas");
        const data = await response.json();
        setReservas(data.reservas);

        // Calcula confirmados y pendientes
        const pagosConfirmados = data.reservas.filter(r => r.pago_total).length;
        const pagosPendientes = data.reservas.length - pagosConfirmados;

        setConfirmados(pagosConfirmados);
        setPendientes(pagosPendientes);
      } catch (error) {
        console.error("Error al cargar reservas:", error);
      }
    };

    fetchReservas();
  }, []);

const totalReservas = confirmados + pendientes;
  const data = {
    labels: [
        `Pagos Confirmados: ${((confirmados / totalReservas)*100).toFixed(2)}%`,
        `Pagos Pendientes: ${((pendientes / totalReservas)*100).toFixed(2)}%`
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
    <div className="reporte">
      <h3>Proporción de Pagos Confirmados y Pendientes</h3>
      <h3>Ando haciendo pruebas todavia</h3>
      <Doughnut data={data} />
    </div>
  );
};

export default Reports;
