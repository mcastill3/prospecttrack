import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get("countryId");

    if (!countryId) {
      // Si no hay countryId, devolvemos todos los países
      return await handleGetCountries();
    }

    // Validación opcional: asegurarse que el ID sea string válido
    if (typeof countryId !== "string" || countryId.trim() === "") {
      return NextResponse.json({ error: "Invalid countryId" }, { status: 400 });
    }

    // Devolvemos las ciudades para el país dado
    return await handleGetCities(countryId);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Función para obtener países
async function handleGetCountries() {
  const countries = await prisma.country.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(countries);
}

// Función para obtener ciudades
async function handleGetCities(countryId: string) {
  const cities = await prisma.city.findMany({
    where: { countryId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(cities);
}
