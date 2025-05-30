// /app/api/generator/companies/countries/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
