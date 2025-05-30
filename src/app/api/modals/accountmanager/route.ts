// /app/api/modals/accountManager/route.ts
import prisma  from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  const managers = await prisma.accountManager.findMany({
    where: {
      OR: [
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
      ],
    },
    take: 10,
    orderBy: { firstName: 'asc' },
  });

  return NextResponse.json(managers);
}