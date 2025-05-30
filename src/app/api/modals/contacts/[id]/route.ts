import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const contact = await prisma.contact.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  if (!contact) return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 });

  return NextResponse.json(contact);
}
