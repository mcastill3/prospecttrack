import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.name || !data.email) {
      return new NextResponse('Name and Email are required', { status: 400 });
    }

    let areaId = null;
    if (data.activityId) {
      const activity = await prisma.activity.findUnique({
        where: { id: data.activityId },
        select: { areaId: true },
      });
      areaId = activity?.areaId || null;
    }

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        value: data.value || 0,
        activityId: data.activityId || null,
        contactId: data.contactId || null,
        companyId: data.companyId || null,
        countryId: data.countryId || null,
        cityId: data.cityId || null,
        accountManagerId: data.accountManagerId || null,
        areaId,  // asignamos aquí
      },
    });

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}