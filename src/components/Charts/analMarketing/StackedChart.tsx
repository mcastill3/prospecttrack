"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type StackedChartProps = {
  data: {
    month: string;
    counts: Record<string, number>;
  }[];
};

const StackedChart: React.FC<StackedChartProps> = ({ data }) => {
  const campaignTypes = Array.from(
    new Set(
      data.flatMap((item) =>
        Object.entries(item.counts)
          .filter(([_, count]) => count > 0)
          .map(([type]) => type)
      )
    )
  );

  const series = campaignTypes.map((type) => ({
    name: type.replace(/_/g, " "), // Reemplaza "_" por espacio
    data: data.map((item) => item.counts[type] || 0),
  }));

  const categories = data.map((item) =>
    item.month.split(" ")[0].toUpperCase() // Extrae solo el mes y lo pone en mayúsculas
  );

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 400,
      stacked: true,
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        dataLabels: {
          total: {
            enabled: true,
            style: { fontSize: "13px", fontWeight: 900 },
          },
        },
      },
    },
    xaxis: {
      type: "category",
      categories,
      labels: {
        style: {
          colors: "#ADADAD", // Color de los labels del eje X
          fontSize: "14px",
          fontWeight: 600, // Hace los textos un poco más gruesos
        },
      },
      axisTicks: {
        color: "#fffff", // Color de las líneas de los ticks del eje X
      },
      axisBorder: {
        color: "#ADADAD", // Color de la línea del eje X
        strokeWidth: 2, // Grosor de la línea del eje X (corregido de strokeWidth)
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#ADADAD",
          fontSize: "14px",
          fontWeight: 600,
        },
      },
      axisTicks: {
        show: false, // Asegura que los ticks sean visibles
        color: "#ADADAD",
      },
      axisBorder: {
        show: true, // Asegura que el eje Y sea visible
        color: "#ADADAD",
        width: 2, // ApexCharts usa `width`, no `strokeWidth`
      },
    },    
    legend: {
      position: "right",
      offsetY: 40,
      labels: {
        colors: "#ADADAD", // Color de las etiquetas de la leyenda
      },
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <div>
      <ReactApexChart options={chartOptions} series={series} type="bar" height={400} />
    </div>
  );
};

export default StackedChart;