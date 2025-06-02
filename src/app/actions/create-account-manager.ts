'use server';

import { accountManagerSchema } from '@/lib/formValidationSchema';
import prisma from '@/lib/prisma';

export async function createAccountManager(data: unknown) {
  const validated = accountManagerSchema.safeParse(data);

  if (!validated.success) {
    console.error('Validation Error:', validated.error.flatten());
    throw new Error('Invalid Account Manager data.');
  }

  const { firstName, lastName, countryId, cityId, areaId } = validated.data;

  return prisma.accountManager.create({
    data: {
      firstName,
      lastName,
      countryId: countryId || null,
      cityId: cityId || null,
      areaId,
    },
  });
}
