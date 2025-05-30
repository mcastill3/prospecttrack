// app/api/events/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export async function GET() {
  try {
    const campaigns = await prisma.activity.findMany({
      select: {
        id: true,
        type: true,
        date: true,
        targetContacts: true,
        attendees: true
      },
    });

    const combinedData = [...campaigns];
    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("Error fetching data: ", error);
    return NextResponse.error();
  }
}
