import { z } from "zod";

export const PlayerRoleEnum = z.enum([
  "DIRECTOR_COMERCIAL",
  "DIRECTOR_MARKETING",
  "ANALISTA_COMERCIAL",
  "ANALISTA_MARKETING",
  "DIGITAL_SALES",
]);

export const SexEnum = z.enum(["male", "female"]);

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