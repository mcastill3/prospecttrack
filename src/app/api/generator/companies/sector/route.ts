import { NextResponse } from "next/server";
import prisma  from "@/lib/prisma"; // Asegúrate de que este import es correcto
import { CompanySector } from "@prisma/client";

// Enum explícito para validar sector
const validSectors = new Set([
  "AGRICULTURE_AND_FARMING",
  "CONSTRUCTION_AND_INFRASTRUCTURE",
  "CONSUMER_AND_RETAIL",
  "DEFENSE_AND_SECURITY",
  "DESIGN_AND_CREATIVE",
  "EDUCATION",
  "ENERGY_AND_ENVIRONMENT",
  "EVENTS_AND_HOSPITALITY",
  "FINANCE_AND_INSURANCE",
  "HEALTH_AND_WELLNESS",
  "INDUSTRY_AND_MANUFACTURING",
  "INFORMATION_TECHNOLOGY_AND_SERVICES",
  "LOGISTICS_AND_TRANSPORTATION",
  "MEDIA_AND_ENTERTAINMENT",
  "NON_PROFITS_AND_PHILANTHROPY",
  "OTHER_MATERIALS_AND_PRODUCTION",
  "PHARMACEUTICALS",
  "PROFESSIONAL_SERVICES_AND_CONSULTING",
  "PUBLIC_SECTOR_AND_GOVERNMENT",
  "REAL_ESTATE",
  "TECHNOLOGY_AND_TELECOMMUNICATIONS",
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sectorParam = searchParams.get("sector");
  const sector = sectorParam as CompanySector; 

 if (!sector || !validSectors.has(sector)) {
  return NextResponse.json({ error: "Invalid or missing sector" }, { status: 400 });
}

  try {
    const companies = await prisma.company.findMany({
      where: { sector },
      select: {
        name: true,
        sector: true,
        contacts: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone1: true,
            phone2: true,
            jobTitle: true,
          },
        },
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error("Error fetching companies by sector:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}