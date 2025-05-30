// /api/contacts/by-email/route.ts
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const contact = await prisma.contact.findUnique({
    where: { email },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  // Devuelve array vacío si no se encuentra
  if (!contact) return NextResponse.json([]);

  // Devuelve un array con un único contacto
  return NextResponse.json([contact]);
}

