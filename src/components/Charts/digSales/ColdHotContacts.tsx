"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const ColdHotContacts: React.FC = () => {
  // Datos de ejemplo para el gráfico radial
  const [chartData] = useState<{
    series: number[];
    options: ApexOptions;
  }>({
    series: [44, 56], // Datos de las categorías (fríos vs calientes)
    options: {
      chart: {
        height: 400,
        type: "radialBar",
        toolbar: { show: false },
        zoom: { enabled: false },
      },      
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: "22px", // Tamaño de la fuente para el nombre
            },
            value: {
              fontSize: "16px", // Tamaño de la fuente para el valor
            },
            total: {
              show: true,
              label: "Total",
              formatter: function () {
                return "249"; // Total de los contactos
              },
            },
          },
          
        },
      },
      labels: ["Cold Contacts", "Hot Contacts"], // Nombres de las categorías
      fill: {
        opacity: 1,
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 400,
            },
          },
        },
      ],
      legend: {
        show: true,
        position: "right", // Colocamos la leyenda en la parte inferior
        offsetY: 40, // Alineamos horizontalmente al centro
        labels: {
          colors: "#ADADAD", // Color de las etiquetas de la leyenda
        },
      },
    },
  });

  // Referencia del gráfico para interacción (por ejemplo, descarga de imagen)
  const chartRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={chartRef}>
      
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="radialBar"
        height={450}
        width={450}
      />
      
    </div>
  );
};

export default ColdHotContacts;