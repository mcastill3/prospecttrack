import React from "react";
import prisma from "@/lib/prisma";
import StackedChart from "../Charts/analMarketing/StackedChart";

// Definir el tipo del objeto final que se pasará al gráfico
type ChartDataItem = {
  month: string;
  counts: Record<string, number>;
};

const StackedChartContainer = async () => {
  // Obtener el número de campañas agrupadas por mes y tipo
  const campaigns = await prisma.activity.groupBy({
    by: ["type", "date"],
    _count: { id: true },
    orderBy: [
      { date: "asc" }, // 🔹 Asegurar que orderBy esté en el formato adecuado
    ],
  });

  // Procesar los datos para agruparlos por mes y tipo
  const processedData: Record<string, ChartDataItem> = campaigns.reduce(
    (acc, campaign) => {
      const month = new Date(campaign.date).toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      if (!acc[month]) {
        acc[month] = { month, counts: {} };
      }

      acc[month].counts[campaign.type] = campaign._count.id;

      return acc;
    },
    {} as Record<string, ChartDataItem>
  );

  // Convertir los datos en un array para el gráfico
  const chartData = Object.values(processedData);

  return (
    <div className="bg-white rounded-xl w-full h-[450px] p-2">
      <h2 className="text-lg font-semibold text-gray-700">Campañas por Mes</h2>
      <StackedChart data={chartData} />
    </div>
  );
};

export default StackedChartContainer;