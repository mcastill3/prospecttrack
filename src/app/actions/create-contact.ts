'use server';


import { contactSchema } from '@/lib/formValidationSchema';
import prisma from '@/lib/prisma';

export async function createContact(data: unknown) {
  const validated = contactSchema.safeParse(data);

  if (!validated.success) {
    console.error('Validation Error:', validated.error.flatten());
    throw new Error('Invalid contact data.');
  }

  const {
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

  return prisma.contact.create({
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
