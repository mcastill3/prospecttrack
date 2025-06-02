// app/api/selects/area/route.ts
import { NextResponse } from "next/server";
import prisma  from "@/lib/prisma";

export async function GET() {
  try {
    const areas = await prisma.area.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(areas);
  } catch (error) {
    console.error("Error fetching account managers", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}