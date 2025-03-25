import React from "react";
import prisma from "@/lib/prisma";
import BarSegmentationChart from "../Charts/analMarketing/BarSegmentationChart";

// Definir tipos
type LeadCount = {
  companyId: string | null;
  _count: { id: number };
};

type Company = { id: string; industry: string };

type CampaignLead = { companyId: string | null };

type Campaign = { id: string; leads: CampaignLead[] };

// ✅ Función para obtener los datos en el servidor
const fetchData = async () => {
  // Obtener el total de leads abiertos por compañía
  const leadsData: LeadCount[] = (await prisma.lead.groupBy({
    by: ["companyId"],
    _count: { id: true },
    where: { status: { not: "CLOSED" } },
  })).sort((a, b) => (a.companyId ?? "").localeCompare(b.companyId ?? ""));
  

  // Obtener compañías con leads
  const companies: Company[] = await prisma.company.findMany({
    where: { id: { in: leadsData.map(ld => ld.companyId).filter(id => id !== null) } },
    select: { id: true, industry: true },
  });

  // Obtener campañas y contar leads por industria
  const campaigns: Campaign[] = await prisma.campaign.findMany({
    where: { leads: { some: { companyId: { in: companies.map(c => c.id) } } } },
    select: { id: true, leads: { select: { companyId: true } } },
  });

  // Mapeo de leads generados por industria
  const conversionMap: Record<string, number> = {};
  campaigns.forEach(campaign =>
    campaign.leads.forEach(lead => {
      const company = companies.find(c => c.id === lead.companyId);
      if (company) {
        conversionMap[company.industry] = (conversionMap[company.industry] || 0) + 1;
      }
    })
  );

  // Agrupar leads por industria
  const industryStats: Record<string, { totalLeads: number; generatedLeads: number }> = {};
  leadsData.forEach(ld => {
    const company = companies.find(c => c.id === ld.companyId);
    if (company) {
      const industry = company.industry;
      industryStats[industry] = industryStats[industry] || { totalLeads: 0, generatedLeads: 0 };
      industryStats[industry].totalLeads += ld._count.id;
      industryStats[industry].generatedLeads = conversionMap[industry] || 0;
    }
  });

  // Formatear datos
  return Object.entries(industryStats).map(([industry, { totalLeads, generatedLeads }]) => ({
    industry,
    totalLeads,
    generatedLeads,
  }));
};

// ✅ Componente Server que espera los datos
const BarSegmentationChartContainer = async () => {
  const processedData = await fetchData();

  return (
    <div className="bg-white rounded-xl w-full h-[450px] p-2">
      <h2 className="text-lg font-semibold text-gray-700">Leads Generados por Industria</h2>
      <BarSegmentationChart data={processedData} />
    </div>
  );
};

export default BarSegmentationChartContainer;
