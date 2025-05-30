'use server';

import prisma from '@/lib/prisma';
import { companySchema } from '@/lib/formValidationSchema';

export async function createCompany(data: unknown) {
  const validated = companySchema.safeParse(data);

  if (!validated.success) {
    console.error("Validation error:", validated.error.flatten());
    throw new Error("Invalid company data");
  }

  const {
    name,
    sector,
    size,
    website,
    revenue,
    countryId,
    cityId,
    status,
  } = validated.data;

  return prisma.company.create({
    data: {
      name,
      sector,
      size,
      website,
      revenue,
      countryId,
      cityId,
      status,
    },
  });
}
