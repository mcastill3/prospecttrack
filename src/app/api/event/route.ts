// app/api/events/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        date: true,
        confirmedAttendees: true,
      },
    });

    const campaigns = await prisma.campaign.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        date: true,
        targetContacts: true,
      },
    });

    const combinedData = [...events, ...campaigns];
    return NextResponse.json(combinedData);
  } catch (error) {
    console.error("Error fetching data: ", error);
    return NextResponse.error();
  }
}
