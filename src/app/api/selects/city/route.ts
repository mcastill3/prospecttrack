// app/api/selects/city/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const countryId = req.nextUrl.searchParams.get("countryId");

  if (!countryId) {
    return new NextResponse("Missing countryId", { status: 400 });
  }

  try {
    const cities = await prisma.city.findMany({
      where: {
        countryId,
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(cities);
  } catch (error) {
    console.error("Error fetching cities", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
