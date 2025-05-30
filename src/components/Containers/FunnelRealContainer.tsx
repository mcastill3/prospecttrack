import prisma from "@/lib/prisma";
import FunnelCampaignChart from "../Charts/dirMarketing/FunnelCampaignChart";

const FunnelRealContainer = async () => {
  // 1. Total de actividades
const totalActivities = await prisma.activity.count();

// 2. Total de leads generados (no filtramos por fecha ni por actividad)
const allLeads = await prisma.lead.findMany({
  select: {
    id: true,
    value: true,
  },
});

const totalLeads = allLeads.length;

// 3. Oportunidades = leads con value > 0
const totalOpportunities = allLeads.filter(lead => (lead.value ?? 0) > 0).length;


  // Datos para gráfico tipo funnel
  const funnelData = [
    { id: "activities", label: "Activities", value: totalActivities },
    { id: "leads", label: "Leads", value: totalLeads },
    { id: "opportunities", label: "Opportunities", value: totalOpportunities },
  ];

  return (
    <div className="bg-white rounded-xl w-full h-[450px] p-6 shadow-lg">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h1 className="text-xl font-semibold text-gray-700">
          Conversion Funnel: Activities → Leads → Opportunities
        </h1>
      </div>
      <div className="flex justify-center">
        <FunnelCampaignChart data={funnelData} />
      </div>
    </div>
  );
};

export default FunnelRealContainer;
