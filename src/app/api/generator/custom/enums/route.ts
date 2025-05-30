// /app/api/generator/custom/enums/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Obtener sectores únicos (company.sector)
    const sectors = await prisma.company.findMany({
      distinct: ['sector'],
      select: { sector: true },
      orderBy: { sector: "asc" },
    });

    // Obtener jobTitles únicos (contact.jobTitle)
    const jobTitles = await prisma.contact.findMany({
      distinct: ['jobTitle'],
      select: { jobTitle: true },
      orderBy: { jobTitle: "asc" },
    });

    return NextResponse.json({
      sectors: sectors.map(s => s.sector),
      jobTitles: jobTitles.map(jt => jt.jobTitle),
    });
  } catch (error) {
    console.error("Error fetching enums:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

