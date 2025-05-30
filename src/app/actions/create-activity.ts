'use server';

import { activityType, activitySchema } from '@/lib/formValidationSchema'; // importa el esquema y enums
import prisma from '@/lib/prisma';


export async function createActivity(data: unknown) {
  // Aquí le agrego el areaName fijo antes de validar
 
  const validated = activitySchema.safeParse(data);

  if (!validated.success) {
    console.error('Validation Error:', validated.error.flatten());
    throw new Error('Invalid activity data.');
  }

  const {
    name,
    type,
    date,
    endtime,
    targetContacts,
    costId,
    areaName,
    contacts,
  } = validated.data;

  const area = await prisma.area.findUnique({
    where: { name: areaName },
  });

  if (!area) {
    throw new Error(`Area with name "${areaName}" not found.`);
  }

  return prisma.activity.create({
    data: {
      name,
      type,
      date: new Date(date),
      endtime: endtime ? new Date(endtime) : null,
      targetContacts,
      costId,
      areaId: area.id,
      activityContacts: contacts
        ? {
            create: contacts.map(({ contactId }) => ({
              contactId,
            })),
          }
        : undefined,
    },
  });
}