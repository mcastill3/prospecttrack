export type Id = string | number;

export type Column = {
   id: Id;
   title: string;

};

export interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone1?: string;
  phone2?: string;
  jobTitle: string;
}

export interface CompanyWithContacts {
  countryId: string;
  name: string;
  sector?: string;
  contacts: Contact[];
}
