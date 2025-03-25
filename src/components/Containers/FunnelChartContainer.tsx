import prisma from "@/lib/prisma";
import FunnelChart from "../Charts/dirMarketing/FunnelChart";

// Definimos un tipo para la estructura de los datos obtenidos de la base de datos
type LeadStage = {
  status: string;
  _count: { _all: number };
};

// Tipo para los datos que usará el gráfico
type ChartData = {
  id: string;
  value: number;
  label: string;
};

// Función para convertir LeadStatus en un formato legible
const formatLabel = (status: string) => {
  return status.replace(/_/g, " "); // Reemplaza "_" por espacio
};

const FunnelChartContainer = async () => {
  // Obtener cantidad de leads por cada estado
  const leadsByStage = await prisma.lead.groupBy({
    by: ["status"],
    _count: { _all: true },
    orderBy: { status: "asc" }, // ✅ Añadir si Prisma lo necesita
  });
  
  

  // Convertimos los datos en un formato adecuado para el gráfico
  const formattedData: ChartData[] = leadsByStage
    .map((stage: LeadStage) => ({
      id: stage.status.toLowerCase(),
      value: stage._count._all,
      label: formatLabel(stage.status),
    }))
    .sort((a: ChartData, b: ChartData) => b.value - a.value); // 🔹 Ordena de mayor a menor

  return (
    <div className="bg-white rounded-xl w-full h-[500px] p-6 shadow-lg transition-all duration-300">
      {/* TITLE */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h1 className="text-xl font-semibold text-gray-700">
          Evolución de Leads en el Pipeline
        </h1>
      </div>
      {/* FUNNEL CHART */}
      <div className="flex justify-center">
        <FunnelChart data={formattedData} />
      </div>
    </div>
  );
};

export default FunnelChartContainer;
