"use client";

import React from "react";
import ReactApexChart from "react-apexcharts";

type LeadsRiskChartProps = {
  series: number[];
  labels: string[];
};

const LeadsRiskChart: React.FC<LeadsRiskChartProps> = ({ series, labels }) => {
  const total = series.reduce((sum, val) => sum + val, 0);

  const state = {
    series: series,
    options: {
      chart: {
        type: "donut" as const,
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "75%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Total",
                formatter: () => `${total}`, // ✅ Total en el centro del donut
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number, opts: any) {
          const total = opts.w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
          const percent = (val / total) * 1;
          return `${percent.toFixed(1)}%`;  // Mostrar porcentaje calculado
        },
        style: {
          fontSize: "14px",
          colors: ["#333"],
        },
      },
      tooltip: {
        y: {
          formatter: function (value: number) {
            const percent = ((value / total) * 100).toFixed(1);
            return `${value} (${percent}%)`; // ✅ Valor y porcentaje en tooltip
          },
        },
      },
      legend: {
        show: true,
        position: "right" as const,
        offsetY: 10,
        labels: {
          colors: "#ADADAD",
        },
        formatter: function (label: string, opts: any) {
          const value = series[opts.seriesIndex];
          return `${label}: ${value}`; // ✅ Valor en la leyenda
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom" as const,
            },
          },
        },
      ],
      labels: labels,
    },
  };

  return (
    <div className="mb-4 ml-8">
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="donut"
          height={350}
          width={350}
        />
      </div>
    </div>
  );
};

export default LeadsRiskChart;