// app/actions/update-activity.ts

'use server';

import prisma from '@/lib/prisma';
import { AreaEnum } from '@/lib/formValidationSchema';

interface UpdateActivityParams {
  id: string;
  name?: string;
  type?: string;
  date?: Date;
  areaName?: AreaEnum;
  contacts?: { contactId: string }[];
}

export async function updateActivity({
  id,
  name,
  type,
  date,
  areaName,
  contacts,
}: UpdateActivityParams) {
  if (name && typeof name !== 'string') {
    throw new Error('Invalid name');
  }

  const dataToUpdate: any = {};

  if (name) dataToUpdate.name = name;
  if (type) dataToUpdate.type = type;
  if (date) dataToUpdate.date = date;
  if (areaName) {
    dataToUpdate.area = { connect: { name: areaName } };
  }
  if (contacts !== undefined) {
    dataToUpdate.activityContacts = {
      deleteMany: {}, // elimina relaciones previas
      create: contacts.map(({ contactId }) => ({ contactId })),
    };
    dataToUpdate.targetContacts = contacts.length; // actualiza targetContacts
  }

  return prisma.activity.update({
    where: { id },
    data: dataToUpdate,
  });
}
