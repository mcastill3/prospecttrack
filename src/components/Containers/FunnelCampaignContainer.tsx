import prisma from "@/lib/prisma";
import FunnelCampaignChart from "../Charts/dirMarketing/FunnelCampaignChart";

// Definir el tipo de dato esperado
type CampaignType = {
  type: string;
  _count: { _all: number };
};

// Función para convertir el tipo de campaña en un formato legible
const formatLabel = (type: string) => {
  return type.replace(/_/g, " "); // Reemplaza "_" por espacio
};

const FunnelCampaignChartContainer = async () => {
  // Obtener cantidad de campañas por cada tipo
  const campaignsByType = await prisma.campaign.groupBy({
    by: ["type"],
    _count: { _all: true },
    orderBy: { type: "asc" }, // ✅ Si lo requiere, agrégalo
  });

  // Convertimos los datos en un formato adecuado para el gráfico
  const formattedData = campaignsByType
    .map((campaign: CampaignType) => ({
      id: campaign.type.toLowerCase(),
      value: campaign._count._all,
      label: formatLabel(campaign.type),
    }))
    .sort((a: { value: number }, b: { value: number }) => b.value - a.value); // 🔹 Ordena de mayor a menor

  return (
    <div className="bg-white rounded-xl w-full h-[500px] p-6 shadow-lg transition-all duration-300">
      {/* TITLE */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h1 className="text-xl font-semibold text-gray-700">Distribución de Campañas por Tipo</h1>
      </div>
      {/* FUNNEL CHART */}
      <div className="flex justify-center">
        <FunnelCampaignChart data={formattedData} />
      </div>
    </div>
  );
};

export default FunnelCampaignChartContainer;