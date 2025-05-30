import * as z from "zod";

export const LeadFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z
  .number()
  .refine((val) => !isNaN(val), {
    message: "Debe ser un número válido",
  })
  .optional()
  .nullable(),

  email: z.string().email().optional(),

  accountManagerId: z.string().optional().nullable(),
  fromActivity: z.boolean().optional(),
  activityId: z.string().uuid().optional().nullable(),
  areaId: z.string().optional().nullable(),

  countryId: z.string().optional().nullable(),
  cityId: z.string().optional().nullable(),

  contactId: z.string().optional().nullable(),
  companyId: z.string().optional().nullable(),

  // Solo necesarios para visualización
  contactFirstName: z.string().optional(),
  contactLastName: z.string().optional(),
  companyName: z.string().optional(),
  areaName: z.string().optional()
});

export type LeadFormData = z.infer<typeof LeadFormSchema>;