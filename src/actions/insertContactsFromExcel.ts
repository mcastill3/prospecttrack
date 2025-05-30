'use server';

import prisma from '@/lib/prisma';
import { z } from 'zod';
import { ContactType, JobTitle, CompanySector } from '@prisma/client';

const contactSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().optional(),
  phone1: z.string().optional(),
  phone2: z.string().optional(),
  country: z.string(),
  city: z.string(),
  jobTitle: z.nativeEnum(JobTitle),
  type: z.nativeEnum(ContactType),
  companyName: z.string(),
  sector: z.string().optional(),
  companySize: z.number().optional(),
  source: z.string(),
  website: z.string().optional(),
  revenue: z.coerce.number().optional(),
});

type ContactInput = z.infer<typeof contactSchema>;

function parseSector(sector?: string): CompanySector | undefined {
  if (!sector) return undefined;
  const upper = sector.toUpperCase().replace(/ /g, '_');
  const enumValues = Object.values(CompanySector);
  return enumValues.includes(upper as CompanySector) ? (upper as CompanySector) : undefined;
}

export async function insertContactsFromExcel(data: ContactInput[]) {
  for (const entry of data) {
    try {
      const {
        country,
        city,
        companyName,
        source,
        sector,
        companySize,
        type,
        revenue,
        website,
        ...contactData
      } = entry;

      // Country
      const countryRecord = await prisma.country.upsert({
        where: { name: country },
        update: {},
        create: { name: country },
      });

      // City
      const cityRecord = await prisma.city.upsert({
        where: { name: city },
        update: {},
        create: {
          name: city,
          countryId: countryRecord.id,
        },
      });

      // Source
      const sourceRecord = await prisma.source.upsert({
        where: { name: source },
        update: {},
        create: { name: source },
      });

      // Sector parsing
      const parsedSector = parseSector(sector);

      // Company (con actualización condicional)
      const existingCompany = await prisma.company.findUnique({
        where: { name: companyName },
      });

      let companyRecord;

      if (existingCompany) {
        const updates: any = {};
        if (existingCompany.cityId !== cityRecord.id) updates.cityId = cityRecord.id;
        if (existingCompany.countryId !== countryRecord.id) updates.countryId = countryRecord.id;
        if (existingCompany.sourceId !== sourceRecord.id) updates.sourceId = sourceRecord.id;
        if (website && existingCompany.website !== website) updates.website = website;
        if (revenue !== undefined && existingCompany.revenue !== revenue) updates.revenue = revenue;
        if (parsedSector && existingCompany.sector !== parsedSector) updates.sector = parsedSector;
        if (companySize !== undefined && existingCompany.size !== companySize) updates.size = companySize;

        if (Object.keys(updates).length > 0) {
          companyRecord = await prisma.company.update({
            where: { name: companyName },
            data: updates,
          });
        } else {
          companyRecord = existingCompany;
        }
      } else {
        companyRecord = await prisma.company.create({
          data: {
            name: companyName,
            cityId: cityRecord.id,
            countryId: countryRecord.id,
            sourceId: sourceRecord.id,
            size: companySize ?? 0,
            ...(website && { website }),
            ...(revenue !== undefined && { revenue }),
            ...(parsedSector && { sector: parsedSector }),
          },
        });
      }

      // Contact (puedes aplicar lógica similar si deseas actualizaciones condicionales)
      const existingContact = await prisma.contact.findUnique({
        where: { email: contactData.email },
      });

      if (existingContact) {
        const contactUpdates: any = {};
        if (existingContact.firstName !== contactData.firstName) contactUpdates.firstName = contactData.firstName;
        if (existingContact.lastName !== contactData.lastName) contactUpdates.lastName = contactData.lastName;
        if (existingContact.phone1 !== contactData.phone1) contactUpdates.phone1 = contactData.phone1;
        if (existingContact.phone2 !== contactData.phone2) contactUpdates.phone2 = contactData.phone2;
        if (existingContact.jobTitle !== contactData.jobTitle) contactUpdates.jobTitle = contactData.jobTitle;
        if (existingContact.cityId !== cityRecord.id) contactUpdates.cityId = cityRecord.id;
        if (existingContact.countryId !== countryRecord.id) contactUpdates.countryId = countryRecord.id;
        if (existingContact.companyId !== companyRecord.id) contactUpdates.companyId = companyRecord.id;
        if (existingContact.sourceId !== sourceRecord.id) contactUpdates.sourceId = sourceRecord.id;
        if (existingContact.type !== type) contactUpdates.type = type;

        if (Object.keys(contactUpdates).length > 0) {
          await prisma.contact.update({
            where: { email: contactData.email },
            data: contactUpdates,
          });
        }
      } else {
        if (!contactData.email) {
          console.warn(`Skipping contact without email:`, contactData);
          continue;
        }

        await prisma.contact.create({
          data: {
            ...contactData,
            email: contactData.email,
            cityId: cityRecord.id,
            countryId: countryRecord.id,
            companyId: companyRecord.id,
            sourceId: sourceRecord.id,
            type,
          },
        });
      }

    } catch (error) {
      console.error(`❌ Error inserting contact ${entry.email}:`, error);
      // Aquí puedes implementar un sistema de log o continuar con el siguiente
    }
  }
}