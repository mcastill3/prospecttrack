// src/app/api/contacts/route.ts

import { NextResponse } from 'next/server';
import prisma  from '@/lib/prisma'; // Asegurate de que esté bien configurado

export async function GET() {
  const contacts = await prisma.contact.findMany({
    include: {
      company: true,
      city: true,
      country: true,
    },
  });

  return NextResponse.json(contacts);
}