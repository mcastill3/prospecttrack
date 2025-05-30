// /app/api/export/list/jobtitle/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";  // Asegúrate de importar Prisma
import { JobTitle } from "@prisma/client";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawJobTitles = searchParams.getAll("jobTitle");
const jobTitles = rawJobTitles.filter((title): title is JobTitle =>
  Object.values(JobTitle).includes(title as JobTitle)
);

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  if (!jobTitles.length) {
    return NextResponse.json({ items: [], total: 0 });
  }

  try {
    const total = await prisma.contact.count({
      where: {
        jobTitle: { in: jobTitles },
      },
    });

    const contacts = await prisma.contact.findMany({
      where: {
        jobTitle: { in: jobTitles },
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

    return NextResponse.json({ items: contacts, total });
  } catch (error) {
    console.error("Error filtering by job title:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}