// LeadsRiskChart.tsx
"use client";

import React from "react";
import ReactApexChart from "react-apexcharts";

// Definimos las props que recibirá el gráfico
type LeadsRiskChartProps = {
  series: number[];  // Datos de porcentaje para el gráfico
  labels: string[];   // Etiquetas para las categorías
};

const LeadsRiskChart: React.FC<LeadsRiskChartProps> = ({ series, labels }) => {
  const state = {
    series: series, // Los datos de los porcentajes
    options: {
      chart: {
        type: "donut" as "donut", // Especificamos que es un gráfico donut
        toolbar: { show: false },
        zoom: { enabled: true },
      },
      legend: {
        show: true,
        position: "right" as "right", // Posición de la leyenda
        offsetY: 10, // Alineamos la leyenda
        labels: {
          colors: "#ADADAD", // Color de las etiquetas de la leyenda
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              // Ajuste del tamaño en pantallas pequeñas
             
            },
            legend: {
              position: "bottom" as "bottom", // Leyenda en la parte inferior para pantallas pequeñas
            },
          },
        },
      ],
      labels: labels, // Etiquetas de las categorías, como "Alto", "Moderado", "Bajo"
    },
  };

  return (
    <div className="mt-8 ml-8">
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="donut" // Especificamos que el gráfico es de tipo 'donut'
          height={300}
        />
      </div>
    </div>
  );
};

export default LeadsRiskChart;