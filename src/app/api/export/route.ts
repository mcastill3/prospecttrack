import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Parser } from "json2csv";

// API que maneja la exportación de los datos a CSV
export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // Filtros que se toman de la URL
  const nameFilter = searchParams.get("name") || "";
  const sectorFilter = searchParams.get("sector") || "";
  const statusFilter = searchParams.get("status") || "";
  const typeFilter = searchParams.get("type") || "";
  const countryIdFilter = searchParams.get("countryId") || "";
  const cityIdFilter = searchParams.get("cityId") || "";

  // Buscar las empresas filtradas
  const companies = await prisma.company.findMany({
    where: {
      ...(nameFilter && {
        name: {
          contains: nameFilter,
          mode: "insensitive",
        },
      }),
      ...(sectorFilter && { sector: sectorFilter as any }),
      ...(statusFilter && { status: statusFilter as any }),
      ...(typeFilter && { revenue: typeFilter === "Enterprise" ? { gte: 500_000_000 } : { lt: 500_000_000 } }),
      ...(countryIdFilter && { countryId: countryIdFilter }),
      ...(cityIdFilter && { cityId: cityIdFilter }),
    },
    include: {
      country: { select: { name: true } },
      city: { select: { name: true } },
    },
  });

  // Convertir las empresas a formato CSV usando json2csv
  const parser = new Parser();
  const csv = parser.parse(companies);

  // Devolver el archivo CSV como respuesta
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="companies.csv"',
    },
  });
}