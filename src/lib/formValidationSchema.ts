import { z } from "zod";
import prisma from "./prisma";

export const PlayerRoleEnum = z.enum([
  "DIRECTOR_COMERCIAL",
  "DIRECTOR_MARKETING",
  "ANALISTA_COMERCIAL",
  "ANALISTA_MARKETING",
  "DIGITAL_SALES",
]);

export const SexEnum = z.enum(["male", "female"]);

export const jobTitles = [
  "CEO", "CIO", "CFO", "CTO", "CISO", "COO",
  "ARCHITECT", "STO", "IT_MANAGEMENT", "INFORMATION_SECURITY", "INFRAESTRUCTURE", "OTHER",
] as const;

export type JobTitle = typeof jobTitles[number];

export const Sector = [
  "AGRICULTURE_AND_FARMING",
    "CONSTRUCTION_AND_INFRASTRUCTURE",
    "CONSUMER_AND_RETAIL",
    "DEFENSE_AND_SECURITY",
    "DESIGN_AND_CREATIVE",
    "EDUCATION",
    "ENERGY_AND_ENVIRONMENT",
    "EVENTS_AND_HOSPITALITY",
    "FINANCE_AND_INSURANCE",
    "HEALTH_AND_WELLNESS",
    "INDUSTRY_AND_MANUFACTURING",
    "INFORMATION_TECHNOLOGY_AND_SERVICES",
    "LOGISTICS_AND_TRANSPORTATION",
    "MEDIA_AND_ENTERTAINMENT",
    "NON_PROFITS_AND_PHILANTHROPY",
    "OTHER_MATERIALS_AND_PRODUCTION",
    "PHARMACEUTICALS",
    "PROFESSIONAL_SERVICES_AND_CONSULTING",
    "PUBLIC_SECTOR_AND_GOVERNMENT",
    "REAL_ESTATE",
    "TECHNOLOGY_AND_TELECOMMUNICATIONS",
] as const;

export type Sector = typeof Sector[number];

export const activityType = [
  "WEBINAR",
  "TRADESHOW",
  "PHYSICAL_EVENT",
  "LINKEDIN_CAMPAIGN",
  "GOOGLE_CAMPAIGN",
  "PAID_MEDIA_BRANDED_CONTENT",
  "WEBSITE_FORM",
  "WEBSITE_REFERRAL",
  "WEBINAR_WITH_VENDOR",
  "TRADESHOW_WITH_VENDOR",
  "PHYSICAL_EVENT_WITH_VENDOR",
  "VENDOR_REFERRAL",
  "BDR",
  "DIGITAL_SALES"
] as const;

export type ActivityType = typeof activityType[number];

export const areaEnums = [
  "CYBERSECURITY",
  "ADVISORY",
  'SECURE_FILE_TRANSFER_B2B',
  'SECURE_CLOUD',
  'SECURE_DATA',
  'COMERCIAL',
] as const;

export type AreaEnum = typeof areaEnums[number];

export const campaignSchema = z.object({
    id: z
    .string().optional(),
    name:z
     .string()
     .min(1, { message: "Campaign name is required!" }),
    type:z
     .enum(["SOCIAL_MEDIA", "WEBINAR", "EMAIL" ], 
        {message:"Type of campaign is required!"}), 
    date: z
     .string()
     .min(1, { message: "Date of release is required!" })
     .transform((val) => new Date(val)), 
     targetContacts: z
     .string()
     .min(1, { message: "Number of contacts included!" })
     .transform((val) => parseInt(val, 10))
     .refine((val) => !isNaN(val) && val > 0, {
       message: "Number of contacts must be a valid number greater than 0!",       
     }),  
 });

 export type CampaignSchema = z.infer<typeof campaignSchema>;

 export const playerSchema = z.object({
  clerkUserId: z.string(),
  id: z.string().uuid().or(z.literal("").optional()),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email!" }),
  name: z.string().min(1, { message: "First name is required!" }),
  surname: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().nullable().optional(),
  
  // Usamos los IDs de las relaciones city y country
  countryId: z.string().uuid({ message: "Country ID is required!" }),
  cityId: z.string().uuid().optional(),

  department: z.string().min(1, { message: "Department is required!" }),

  // Validación usando el enum
  role: PlayerRoleEnum,
  sex: SexEnum,

  img: z.string().optional(),
});

export type PlayerSchema = z.infer<typeof playerSchema>;

export const contactSchema = z.object({
  id: z.string().uuid().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone1: z.string().optional(),
  jobTitle: z.enum(jobTitles),
  type: z.enum(['PROSPECT', 'CLIENT', 'PARTNER']),
  countryId: z.string().min(1),
  cityId: z.string().min(1),
  companyId: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const companySchema = z.object({ 
  name: z.string().min(1, "Company name is required"),
  sector: z.enum(Sector),
  size: z.number().int().positive(),
  website: z.string().url().optional(),
  revenue: z.number().positive().optional(),
  countryId: z.string().min(1),
  cityId: z.string().min(1),
  status: z.enum(["ACTIVE", "INACTIVE"]),
})

export type CompanyFormData = z.infer<typeof companySchema>;

export const leadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  value: z
    .number()
    .min(0, "Value cannot be negative")
    .optional()
    .or(z.string().regex(/^\d*\.?\d*$/, "Must be a valid number")), // para controlar input de tipo texto que representa número
  email: z.string().email("Invalid email").min(1, "Email is required"),
  activityId: z.string().uuid().nullable(),
  contactId: z.string().optional(),
  companyId: z.string().optional(),
  countryId: z.string().optional(),
  cityId: z.string().optional(),
  accountManagerId: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export const activitySchema = z.object({
  name: z.string().optional(),
  type: z.enum(activityType),
  date: z.preprocess(
    (val) => {
      if (val instanceof Date) return val.toISOString();
      return val;
    },
    z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" })
  ),
  endtime: z.preprocess(
    (val) => {
      if (val instanceof Date) return val.toISOString();
      return val;
    },
    z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid endtime format" })
  ),
  targetContacts: z.number().optional(),
  costId: z.string().optional(),
  areaName: z.enum(areaEnums),
  contacts: z.array(
    z.object({
      contactId: z.string(),
      // atendido eliminado
    })
  ).optional(),
});

export type ActivityFormData = z.infer<typeof activitySchema>;