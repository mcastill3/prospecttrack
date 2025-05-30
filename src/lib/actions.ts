"use server"

import { LeadFormSchema } from "@/components/forms/Modal/LeadFormschema";
import prisma from "@/lib/prisma";

export async function createLead(data: unknown) {
  try {
    const validated = LeadFormSchema.parse(data);
    console.log("✅ Datos validados que se enviarán a Prisma:");
    console.table(validated);
    console.log("🟢 createLead fue llamado");

    const newLead = await prisma.lead.create({
      data: {
        name: validated.name,
        value: validated.value ?? 0,
        accountManagerId: validated.accountManagerId ?? null,
        activityId: validated.activityId ?? null,
        areaId: validated.areaId ?? null,
        countryId: validated.countryId ?? null,
        cityId: validated.cityId ?? null,
        contactId: validated.contactId ?? null,
        companyId: validated.companyId ?? null,
      },
    });

    return newLead;

  } catch (error) {
    console.error("❌ Error en createLead:", error);
    throw error; // Esto hará que el catch del `onSubmit` lo capture
  }
}
