// /app/api/export/list/custom/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Leer los filtros
    const countryId = searchParams.get("countryId");
    const cityId = searchParams.get("cityId");
    const sector = searchParams.get("sector");
    const jobTitles = searchParams.getAll("jobTitle"); // puede venir varios
    const businessSize = searchParams.get("businessSize");

    // Construir el filtro para prisma
    const where: any = {};

    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    if (countryId) where.countryId = countryId;
    if (cityId) where.cityId = cityId;
    if (jobTitles.length) where.jobTitle = { in: jobTitles };
    // Filtros relacionados a company
    const companyFilter: any = {};

    if (businessSize) {
      if (businessSize === "enterprise") {
        companyFilter.revenue = { gte: 500_000_000 };
      } else if (businessSize === "smb") {
        companyFilter.revenue = { lt: 500_000_000 };
      }
    }

    if (sector) {
    companyFilter.sector = sector; // esto debe coincidir exactamente con el enum
    }

    if (Object.keys(companyFilter).length > 0) {
    where.company = companyFilter;
    }
    const total = await prisma.contact.count({ where });
    // Prisma query con relaciones (join para company)
    const contacts = await prisma.contact.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone1: true,
        phone2: true,
        jobTitle: true,
        company: {
          select: {
            name: true,
            sector: true,
            revenue: true,
          },
        },
      },
    });

    return NextResponse.json({ items: contacts, total });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}