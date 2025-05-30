"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, CategoryScale } from "chart.js";

// Registrar los elementos necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title, CategoryScale);

interface SectorAccountChartProps {
  data: { id: string; label: string; value: number }[];
}

const SectorAccountChart = ({ data }: SectorAccountChartProps) => {
  // Prepara los datos para Chart.js
  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: "Sector Distribution",
        data: data.map((item) => item.value),
        backgroundColor: data.map((item) => `hsl(${Math.random() * 360}, 70%, 60%)`), // Asigna colores aleatorios
        borderWidth: 1,
      },
    ],
  };

  // Opciones del gráfico para personalizar el comportamiento y estilo
  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => `${tooltipItem.label}: ${tooltipItem.raw}`, // Muestra el valor al pasar el mouse
        },
      },
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: "Company Distribution by Sector",
      },
    },
    cutout: "50%", // Esto crea el estilo de "donut"
  };

  return (
    <div className="w-full h-[400px]">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default SectorAccountChart;


