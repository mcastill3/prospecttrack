import { ContactType, JobTitle } from "@prisma/client";

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone1?: string | null;
  phone2?: string | null;
  jobTitle: JobTitle;
  type: ContactType;
  company?: {
    name: string | null;
  } | null;
  country?: {
    name: string | null;
  } | null;
  city?: {
    name: string | null;
  } | null;
}