import { AccountManager } from "./aacountManager";


export interface Lead {
  id: string;
  name: string;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  value?: number | null; // ← aquí
  accountManager?: {
    firstName: string;
    lastName: string;
  } | null;
  contact?: {
    firstName: string;
    lastName: string;
  } | null;
  company?: {
    id: string;
    name: string;
    revenue?: number | null; // también puedes corregir esto si aplica
  } | null;
  activity?: {
    id: string;
    type: string;
    date: string | Date; // mejor permitir ambos
  } | null;
}