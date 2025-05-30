// app/api/selects/activities/route.ts
import { NextResponse } from "next/server";
import prisma  from "@/lib/prisma";

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
  select: {
    id: true,
    name: true,
    date: true,
    areaId: true,
    area: {
      select: {
        name: true, // <- Aquí traes el nombre del área
      },
    },
  },
  orderBy: {
    date: "desc",
  },
});

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
