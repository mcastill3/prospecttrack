// /app/api/modals/country/route.ts 
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  const countries = await prisma.country.findMany({
    where: {
      name: { contains: q, mode: 'insensitive' },
    },
    select: { id: true, name: true },
    take: 10, // Limitar resultados para performance
  });

  return NextResponse.json(countries);
}