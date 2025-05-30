"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Filler,
} from "chart.js";

import "chartjs-adapter-date-fns"; // Para formatear fechas


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

interface TrackingChartProps {
  data: { month: string; activities: number; leads: number; opportunities: number }[];
}

const TrackingChart = ({ data }: TrackingChartProps) => {
  const chartData: ChartData<"bar"> = {
    labels: data.map((item) => item.month), // Meses en formato ISO yyyy-MM
    datasets: [
      {
        label: "Activities",
        borderRadius: 8,
        barThickness: 40,
        data: data.map((item) => item.activities),
        backgroundColor: "rgba(75, 192, 192, 0.8)",
      },
      {
        label: "Leads",
        borderRadius: 8,
        barThickness: 40,
        data: data.map((item) => item.leads),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
      },
      {
        label: "Opportunities",
        borderRadius: 8,
        barThickness: 40,
        data: data.map((item) => item.opportunities),
        backgroundColor: "rgba(153, 102, 255, 0.8)",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Activities, Leads, and Opportunities by Month",
      },
    },
    layout: {
      padding: 20,
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          callback: function (value, index, ticks) {
            const raw = data[index].month; // yyyy-MM
            const date = new Date(`${raw}-01`);
            return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
          },
          color: "#333",
          font: {
            weight: "bold",
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
          color: "#333",
          font: {
            weight: "bold",
          },
        },
        grid: {
          color: "#eee",
        },
      },
    },
  };

  return (
    <div className="w-full h-[450px] bg-white rounded-xl shadow p-4">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TrackingChart;