import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // Enterprise o SMB
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  if (!type || (type !== "Enterprise" && type !== "SMB")) {
    return NextResponse.json({ error: "Missing or invalid type" }, { status: 400 });
  }

  try {
    // Define filtro para revenue según tipo
    const revenueFilter =
      type === "Enterprise"
        ? { gte: 500000000 }
        : { lt: 500000000 };

    // Contar contactos donde la empresa cumple filtro por revenue
    const total = await prisma.contact.count({
      where: {
        company: {
          revenue: revenueFilter,
        },
      },
    });

    // Obtener contactos paginados
    const contacts = await prisma.contact.findMany({
      where: {
        company: {
          revenue: revenueFilter,
        },
      },
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

    // Formatear resultados
    const items = contacts.map((contact) => ({
      ...contact,
      companyName: contact.company?.name || "N/A",
      sector: contact.company?.sector || "N/A",
      revenue: contact.company?.revenue || 0,
      type,
    }));

    return NextResponse.json({ items, total });
  } catch (error) {
    console.error("Error fetching contacts by type:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
