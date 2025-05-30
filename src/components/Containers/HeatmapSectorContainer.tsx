import prisma from "@/lib/prisma";
import HeatmapSectorChart from "../Charts/HeatmapSectorChart";

const abbrevSector = (sector: string) => {
  const map: Record<string, string> = {
    AGRICULTURE_AND_FARMING: "Agric.",
    CONSTRUCTION_AND_INFRASTRUCTURE: "Constr.",
    CONSUMER_AND_RETAIL: "Cons/Retail",
    DEFENSE_AND_SECURITY: "Defense",
    DESIGN_AND_CREATIVE: "Design",
    EDUCATION: "Edu",
    ENERGY_AND_ENVIRONMENT: "Energy",
    EVENTS_AND_HOSPITALITY: "Events",
    FINANCE_AND_INSURANCE: "Finance",
    HEALTH_AND_WELLNESS: "Health",
    INDUSTRY_AND_MANUFACTURING: "Industry",
    INFORMATION_TECHNOLOGY_AND_SERVICES: "IT & Services",
    LOGISTICS_AND_TRANSPORTATION: "Logistics",
    MEDIA_AND_ENTERTAINMENT: "Media",
    NON_PROFITS_AND_PHILANTHROPY: "Non-Profit",
    OTHER_MATERIALS_AND_PRODUCTION: "Other Mat.",
    PHARMACEUTICALS: "Pharma",
    PROFESSIONAL_SERVICES_AND_CONSULTING: "Prof. Services",
    PUBLIC_SECTOR_AND_GOVERNMENT: "Public Sector",
    REAL_ESTATE: "Real Estate",
    TECHNOLOGY_AND_TELECOMMUNICATIONS: "Tech & Telecom",
  };
  return map[sector] ?? sector;
};

const HeatmapSectorContainer = async () => {
  const leads = await prisma.lead.findMany({
    where: {
      companyId: { not: null },
      company: {
        sector: { not: null },
      },
    },
    include: {
      company: true,
    },
  });

  const counts: Record<string, number> = {};

  leads.forEach((lead) => {
    const sector = lead.company?.sector;
    if (sector) {
      const abbr = abbrevSector(sector);
      counts[abbr] = (counts[abbr] ?? 0) + 1;
    }
  });

  return (
      <div className="bg-white rounded-xl w-full h-[420px] p-6 shadow-lg">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h1 className="text-xl font-semibold text-gray-700">
          Leads Count by Sector
        </h1>
      </div>
      <div className="flex justify-center">
        <HeatmapSectorChart data={counts} />
      </div>
    </div>

  )
  
  
  
};

export default HeatmapSectorContainer;