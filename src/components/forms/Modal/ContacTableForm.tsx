'use client';

import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Image from 'next/image';


type CompanySector =
  | "AGRICULTURE_AND_FARMING"
  | "CONSTRUCTION_AND_INFRASTRUCTURE"
  | "CONSUMER_AND_RETAIL"
  | "DEFENSE_AND_SECURITY"
  | "DESIGN_AND_CREATIVE"
  | "EDUCATION"
  | "ENERGY_AND_ENVIRONMENT"
  | "EVENTS_AND_HOSPITALITY"
  | "FINANCE_AND_INSURANCE"
  | "HEALTH_AND_WELLNESS"
  | "INDUSTRY_AND_MANUFACTURING"
  | "INFORMATION_TECHNOLOGY_AND_SERVICES"
  | "LOGISTICS_AND_TRANSPORTATION"
  | "MEDIA_AND_ENTERTAINMENT"
  | "NON_PROFITS_AND_PHILANTHROPY"
  | "OTHER_MATERIALS_AND_PRODUCTION"
  | "PHARMACEUTICALS"
  | "PROFESSIONAL_SERVICES_AND_CONSULTING"
  | "PUBLIC_SECTOR_AND_GOVERNMENT"
  | "REAL_ESTATE"
  | "TECHNOLOGY_AND_TELECOMMUNICATIONS";


interface Country {
  name: string;
}

interface City {
  name: string;
}

interface Company {
  name: string;
  sector?: CompanySector | null;
}

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone1?: string | null;
  phone2?: string | null;
  city?: City;
  country?: Country;
  company?: Company | null;
  jobTitle: string;
}


const countryCodeMap: Record<string, string> = {
  Spain: "ES", France: "FR", Italy: "IT", "United States": "US", Mexico: "MX", USA: "US",
};

const getFlagImageUrl = (country: string) => {
  const code = countryCodeMap[country];
  return code
    ? `https://flagcdn.com/w40/${code.toLowerCase()}.png`
    : "https://via.placeholder.com/40x30";
};

interface ContactTableFormProps {
  contacts: Contact[];
  getFlagImageUrl: (countryName: string) => string;
  selectedContactIds: string[];
  onSelectContact: (ids: string[]) => void;
}

const ContactTableForm: React.FC<ContactTableFormProps> = ({
 contacts,
  getFlagImageUrl,
  selectedContactIds,
  onSelectContact,
}) => {
  const [jobTitleFilter, setJobTitleFilter] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<string>('');
  const safeContacts = contacts ?? [];

  const filteredContacts = contacts?.filter((contact) => {
  const jobMatch = jobTitleFilter ? contact.jobTitle === jobTitleFilter : true;
  const sectorMatch = sectorFilter ? contact.company?.sector === sectorFilter : true;
  return jobMatch && sectorMatch;
}) ?? [];

  const onToggleContact = (id: string) => {
    const updated = selectedContactIds.includes(id)
      ? selectedContactIds.filter((c) => c !== id)
      : [...selectedContactIds, id];
    onSelectContact(updated);
  };

 const handleSelectAll = (checked: boolean) => {
  onSelectContact(checked ? filteredContacts.map((c) => c.id) : []);
};


  const allSelected =
  Array.isArray(filteredContacts) &&
  filteredContacts.length > 0 &&
  selectedContactIds.length === filteredContacts.length;

  const formatSector = (sector?: CompanySector | null) => {
    if (!sector) return "N/A";
    return sector
        .toLowerCase()
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  };

const formatJobTitle = (title: string) =>
  title.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
  <>
    <div className="flex gap-4 mb-4">
        <div className="w-1/2">
            <Select onValueChange={setJobTitleFilter}>
            <SelectTrigger>
                <SelectValue placeholder="Filter by Job Title" />
            </SelectTrigger>
            <SelectContent>
             {contacts?.length &&
                [...new Set(safeContacts.map((c) => c.jobTitle))].map((job) => (
                <SelectItem key={job} value={job}>
                    {job.replace(/_/g, " ")}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        <div className="w-1/2">
            <Select onValueChange={setSectorFilter}>
            <SelectTrigger>
                <SelectValue placeholder="Filter by Sector" />
            </SelectTrigger>
            <SelectContent>
              {contacts?.length &&
                [...new Set(contacts.map((c) => c.company?.sector).filter(Boolean))].map((sector) => (
                <SelectItem key={sector} value={sector!}>
                    {formatSector(sector)}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
    </div>
    <Table className="min-w-full border-collapse">
      <TableHeader className="bg-gray-900 text-white font-semibold">
        <TableRow>
          <TableHead className="py-4 px-6 text-left text-white">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Name</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Email</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Organization</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Sector</TableHead>
          <TableHead className="py-4 px-6 text-left text-white whitespace-nowrap">Job Title</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Phone</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Country</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">City</TableHead>
          
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {filteredContacts.map((contact) => (
          <TableRow key={contact.id} className="hover:bg-gray-100">
            <TableCell className="py-4 px-6 text-left text-xs">
              <input
                type="checkbox"
                checked={selectedContactIds.includes(contact.id)}
                onChange={() => onToggleContact(contact.id)}
              />
            </TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">
              {contact.firstName} {contact.lastName}
            </TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">{contact.email}</TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">{contact.company?.name || 'N/A'}</TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">{formatSector(contact.company?.sector)}</TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">{formatJobTitle(contact.jobTitle)}</TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">{contact.phone1 || 'N/A'}</TableCell>
            <TableCell className="py-4 px-6 text-left text-xs flex items-center gap-2">
              <Image
                src={getFlagImageUrl(contact.country?.name || 'UN')}
                alt={contact.country?.name || 'Unknown'}
                width={24}
                height={16}
                className="rounded-sm border border-gray-300"
              />
              {contact.country?.name || 'N/A'}
            </TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">{contact.city?.name || 'N/A'}</TableCell>
            
          </TableRow>
        ))}
      </TableBody>
    </Table>
</>
  );
};

export default ContactTableForm;