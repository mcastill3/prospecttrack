"use client";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

const CountChart = ({ leadsByStatus, totalLeads }: { 
  leadsByStatus: { status: string; _count: { id: number } }[]; 
  totalLeads: number 
}) => {
  // Definir colores por status
  const statusColors: Record<string, string> = {
    NEW: "#1E1E8A",
    CONTACTED: "#8F70AC",
    QUALIFIED: "#6600E4",
  };

  // Crear un objeto con valores por defecto (para evitar que falten estados)
  const defaultStatuses = ["NEW", "CONTACTED", "QUALIFIED"];
  const leadsMap = Object.fromEntries(leadsByStatus.map(({ status, _count }) => [status, _count.id]));

  // Generar datos para el gráfico (incluyendo los estados con 0 leads)
  const data = defaultStatuses.map(status => ({
    name: status,
    count: leadsMap[status] || 0, // Si no existe en leadsByStatus, asignar 0
    fill: statusColors[status],
  }));

  // Agregar total general al gráfico
  data.push({
    name: "Total",
    count: totalLeads,
    fill: "#6565DD",
  });

  return (
    <div className="relative w-full h-[75%]">
      <ResponsiveContainer>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="40%"
          outerRadius="100%"
          barSize={32}
          data={data}
        >
          <RadialBar background dataKey="count" cornerRadius={10} />
        </RadialBarChart>
      </ResponsiveContainer>
      <Image
        src="/industry.png"
        alt="Industry Icon"
        width={50}
        height={50}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default CountChart;