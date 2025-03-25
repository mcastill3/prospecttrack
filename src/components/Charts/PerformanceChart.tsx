"use client";
import Image from "next/image";
import { PieChart, Pie, ResponsiveContainer } from "recharts";
import clsx from "clsx"; // Para manejar clases dinámicas

const PerformanceChart = ({ leadsCount, monthlyGoal }: { leadsCount: number; monthlyGoal: number }) => {
  const performancePercentage = (leadsCount / monthlyGoal) * 100;
  const remainingLeads = Math.max(monthlyGoal - leadsCount, 0);

  let fillColor = "#C3EBFA"; // Azul por defecto
  let message = "Mantén el ritmo.";
  let messageColor = "text-gray-600";

  if (performancePercentage < 50) {
    fillColor = "#D9534F"; // Rojo (<50%)
    message = `Faltan ${remainingLeads} leads para alcanzar la meta.`;
    messageColor = "text-red-600";
  } else if (performancePercentage <= 100) {
    fillColor = "#F0AD4E"; // Amarillo (50%-100%)
    message = `Estás cerca, faltan ${remainingLeads} leads.`;
    messageColor = "text-yellow-700";
  } else {
    fillColor = "#5CB85C"; // Verde (>100%)
    message = "Objetivo alcanzado, excelente trabajo.";
    messageColor = "text-green-700";
  }

  const data = [
    { name: "Completed", value: leadsCount, fill: fillColor },
    { name: "Remaining", value: remainingLeads, fill: "#E0E0E0" },
  ];

  return (
    <div className="bg-white p-6 rounded-md shadow-sm h-80 relative">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-lg font-medium text-gray-700">Performance</h1>
        <Image src="/moreDark.png" alt="" width={16} height={16} />
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie dataKey="value" startAngle={180} endAngle={0} data={data} cx="50%" cy="50%" innerRadius={60} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-semibold text-gray-800">{leadsCount}</h1>
        <p className="text-sm text-gray-500">Leads generados</p>
        <p className={clsx("text-sm mt-1", messageColor)}>{message}</p>
      </div>
      <h2 className="text-sm text-gray-600 absolute bottom-4 left-0 right-0 text-center">
        Meta mensual: {monthlyGoal} leads
      </h2>
    </div>
  );
};

export default PerformanceChart;