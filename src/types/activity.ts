import { Lead } from "./leads"; // Asegúrate de que esto exista
import { Contact } from "./contact"; // Define si usas contactos

interface Area {
  id: string;
  name: "CYBERSECURITY" | "ADVISORY" | "SECURE_FILE_TRANSFER_B2B" | "SECURE_CLOUD" | "SECURE_DATA" | "COMERCIAL";
}


export interface ActivityWithLeads {
  area: Area | null;
  cost: any;
  id: string;
  name: string | null;
  type: string;
  date: string | Date;  
  attendees?: number | null;  
  targetContacts?: number | null;
  costId?: string | null;
  endtime?: Date | null;
  leads: {
    id: string;
    name: string;
    value: number | null;
    accountManager?: {
      firstName: string;
      lastName: string;
    } | null;
    contact?: {
      firstName: string;
      lastName: string;
      jobTitle: string; // <-- agregado aquí
    } | null;
    company?: {
      id: string;
      name: string;
      revenue: number | null;
    } | null;
  }[];
}


