// /api/modals/contacts/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');

  if (!q || q.length < 2) return NextResponse.json([]);

  const contacts = await prisma.contact.findMany({
    where: {
      email: {
        contains: q,
        mode: 'insensitive',
      },
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
    take: 10,
  });

  return NextResponse.json(contacts);
}
