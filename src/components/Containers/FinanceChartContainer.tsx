import { PrismaClient } from "@prisma/client";
import FinanceChart from "../Charts/FinanceChart";
import Image from "next/image";

const prisma = new PrismaClient();

type MonthlyCostData = {
  name: string; // Formato "YYYY-MM"
  cost: number; // Suma total de los costos de Campaigns + Events
};

export const getCostsByMonth = async (): Promise<MonthlyCostData[]> => {
  // Obtener los costos de las campañas
  const campaigns = await prisma.activity.findMany({
    where: {
      date: {
        gte: new Date("2025-01-01"),
      },
    },
    select: {
      date: true,
      cost: {
        select: {
          amount: true,
        },
      },
    },
  });

  

  // Agrupar los costos por mes y sumarlos
  const monthlyCosts: Record<string, number> = {};

  // Agregar los costos de las campañas
  campaigns.forEach((campaign) => {
    const month = campaign.date.toISOString().substring(0, 7); // "YYYY-MM"
    const cost = campaign.cost?.amount ?? 0;

    if (!monthlyCosts[month]) {
      monthlyCosts[month] = 0;
    }
    monthlyCosts[month] += cost;
  });

  

  // Convertir a array y ordenar por mes
  const result = Object.entries(monthlyCosts)
    .map(([name, cost]) => ({
      name,
      cost, // La suma de los costos de las campañas y eventos
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // Ordenar de forma ascendente

  return result;
};

const FinanceChartContainer = async () => {
  const monthlyData = await getCostsByMonth();

  return (
    <div className="rounded-xl w-full h-[350px] bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold ml-2">Monthly Propsection Costs - €</h1>
        
      </div>
      <FinanceChart data={monthlyData} />
    </div>
  );
};

export default FinanceChartContainer;