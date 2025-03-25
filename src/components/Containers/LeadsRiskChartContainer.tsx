// LeadsRiskChartContainer.tsx
import React from "react";
import prisma from "@/lib/prisma"; // Usamos prisma para acceder a la base de datos
import LeadsRiskChart from "../Charts/digSales/LeadsRiskChart";

// Obtener los leads en riesgo desde la base de datos
const getLeadsAtRiskFromDatabase = async () => {
  return await prisma.lead.findMany({
    where: { status: { notIn: ["CLOSED"] } },
    include: { company: true },
  });
};

// Calcular nivel de riesgo según la fecha de última actualización
type RiskLevel = "Alto" | "Moderado" | "Bajo";

const getRiskLevel = (updatedAt: Date): { label: RiskLevel; color: string } => {
  const now = new Date();
  const daysDifference = Math.floor(
    (now.getTime() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDifference > 10)
    return { label: "Alto", color: "bg-red-600 text-white animate-pulse" };
  if (daysDifference > 5)
    return { label: "Moderado", color: "bg-yellow-500 text-black" };
  return { label: "Bajo", color: "bg-green-500 text-white" };
};

// Componente principal
const LeadsRiskChartContainer = async () => {
  const leads = await getLeadsAtRiskFromDatabase();

  // Contamos la cantidad de leads por nivel de riesgo
  const riskCounts: Record<RiskLevel, number> = {
    Alto: 0,
    Moderado: 0,
    Bajo: 0,
  };

  leads.forEach((lead) => {
    const risk = getRiskLevel(lead.updatedAt).label;
    riskCounts[risk] += 1;
  });

  // Calculamos el porcentaje de cada nivel de riesgo
  const totalLeads = leads.length;
  const riskPercentages = {
    Alto: Math.round((riskCounts.Alto / totalLeads) * 100),
    Moderado: Math.round((riskCounts.Moderado / totalLeads) * 100),
    Bajo: Math.round((riskCounts.Bajo / totalLeads) * 100),
  };


  // Pasamos los datos de riesgo como props al gráfico
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold ml-2">Riesgo de Leads</h1>
      </div>

      {/* Enviamos los datos de riesgo al gráfico */}
      <LeadsRiskChart
        series={[riskPercentages.Alto, riskPercentages.Moderado, riskPercentages.Bajo]}
        labels={["Alto", "Moderado", "Bajo"]}
      />
 
    </div>
  );
};

export default LeadsRiskChartContainer;
