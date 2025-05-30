'use server';

import { contactSchema } from '@/lib/formValidationSchema';
import prisma from '@/lib/prisma';

export async function updateContact(data: unknown) {
  const validated = contactSchema.safeParse(data);

  if (!validated.success) {
    console.error('Validation Error:', validated.error.flatten());
    throw new Error('Invalid contact data.');
  }

  const {
    id,
    firstName,
    lastName,
    email,
    phone1,
    jobTitle,
    type,
    countryId,
    cityId,
    companyId,
  } = validated.data;

  if (!id) {
    throw new Error('Contact ID is required for update.');
  }

  return prisma.contact.update({
    where: { id },
    data: {
      firstName,
      lastName,
      email,
      phone1,
      jobTitle,
      type,
      countryId,
      cityId,
      companyId: companyId || null,
    },
  });
}

