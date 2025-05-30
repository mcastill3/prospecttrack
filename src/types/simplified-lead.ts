export interface SimplifiedLead {
  id: string;
  name: string;
  accountManager: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}
