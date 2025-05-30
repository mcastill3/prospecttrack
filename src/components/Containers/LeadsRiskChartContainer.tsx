// LeadsRiskChartContainer.tsx
import React from "react";
import prisma from "@/lib/prisma";
import LeadsRiskChart from "../Charts/digSales/LeadsRiskChart";

type RiskLevel = "High" | "Medium" | "Low";

const getLeadsAtRiskFromDatabase = async () => {
  return await prisma.lead.findMany({
    where: { status: { notIn: ["CLOSED"] } },
    include: { company: true },
  });
};

const getRiskLevel = (updatedAt: Date): { label: RiskLevel; color: string } => {
  const now = new Date();
  const daysDifference = Math.floor(
    (now.getTime() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDifference > 10) return { label: "High", color: "bg-red-600 text-white animate-pulse" };
  if (daysDifference > 5) return { label: "Medium", color: "bg-yellow-500 text-black" };
  return { label: "Low", color: "bg-green-500 text-white" };
};

const LeadsRiskChartContainer = async () => {
  const leads = await getLeadsAtRiskFromDatabase();

  const riskCounts: Record<RiskLevel, number> = { High: 0, Medium: 0, Low: 0 };

  leads.forEach((lead) => {
    const risk = getRiskLevel(lead.updatedAt).label;
    riskCounts[risk]++;
  });

  // PASAMOS LOS VALORES REALES (no los porcentajes)
  return (
    <div className="bg-white rounded-xl w-full h-[420px] p-6 shadow-lg">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h1 className="text-xl font-semibold text-gray-700">Leads Risk</h1>
      </div>
      <div className="flex justify-center">
        <LeadsRiskChart
          series={[riskCounts.High, riskCounts.Medium, riskCounts.Low]}
          labels={["High", "Medium", "Low"]}
        />
      </div>
    </div>
  );
};

export default LeadsRiskChartContainer;
