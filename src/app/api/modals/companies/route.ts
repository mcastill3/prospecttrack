// /api/modals/companies/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query || query.length < 2) {
    return NextResponse.json([]); // siempre devolver JSON
  }

  const companies = await prisma.company.findMany({
    where: {
      name: {
        contains: query,
        mode: 'insensitive',
      },
    },
    take: 10,
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(companies);
}
