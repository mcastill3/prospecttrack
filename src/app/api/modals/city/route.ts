// /app/api/modals/city/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const countryId = searchParams.get('countryId');

  const cities = await prisma.city.findMany({
    where: {
      name: { contains: q, mode: 'insensitive' },
      ...(countryId ? { countryId } : {}), // filtro dinámico si viene el parámetro
    },
    take: 10,
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(cities);
}
