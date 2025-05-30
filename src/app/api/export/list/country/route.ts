// app/api/export/list/country/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countryId = searchParams.get("countryId");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  if (!countryId) {
    return NextResponse.json({ error: "Missing countryId" }, { status: 400 });
  }

  try {
    // Count total contacts in companies from this country
    const total = await prisma.contact.count({
      where: {
        company: {
          countryId,
        },
      },
    });

    // Get contacts joined with company info, paginated
    const contacts = await prisma.contact.findMany({
      where: {
        company: {
          countryId,
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
          },
        },
      },
    });

    // Format each item to include company fields at root level (optional)
    const items = contacts.map((contact) => ({
      ...contact,
      companyName: contact.company?.name || "N/A",
      sector: contact.company?.sector || "N/A",
    }));

    return NextResponse.json({ items, total });
  } catch (error) {
    console.error("Error fetching contacts by country:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
