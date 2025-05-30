// /api/modals/companies/[id]/route.ts
import prisma  from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const company = await prisma.company.findUnique({
    where: { id: params.id },
    include: {
      country: true,
      city: true,
    },
  });

  if (!company) return NextResponse.json({ error: 'Company not found' }, { status: 404 });

  return NextResponse.json(company);
}