import { Contact } from "./contact";
import { Lead } from "./leads";  // Importamos el tipo Lead
import { CompanySector } from "@prisma/client";  // Importamos CompanySector de Prisma
import { SimplifiedLead } from "./simplified-lead";

export interface ExtendedCompany {
  leadCount: number;
  classification: string;
  id: string;
  name: string;
  sector?: CompanySector | null;
  size: number;
  website?: string | null;
  revenue?: number | null;
  country?: {
    name: string | null;
    id: string;
  } | null;
  city?: {
    name: string | null;
    id: string;
  } | null;
  leads?: SimplifiedLead[];  // Relación con los leads
  contacts?: Contact[];
}