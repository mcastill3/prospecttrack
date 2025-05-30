// app/api/selects/account-managers/route.ts
import { NextResponse } from "next/server";
import prisma  from "@/lib/prisma";

export async function GET() {
  try {
    const accountManagers = await prisma.accountManager.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
      orderBy: {
        lastName: "asc",
      },
    });

    return NextResponse.json(accountManagers);
  } catch (error) {
    console.error("Error fetching account managers", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}