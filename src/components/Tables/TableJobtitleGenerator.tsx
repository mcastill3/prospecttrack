"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone1?: string | null;
  phone2?: string | null;
  jobTitle: string;
  company?: {
    name: string;
    sector?: string | null;
  } | null;
}

interface Props {
  contacts: Contact[];
}

const formatLabel = (value?: string | null) => {
  if (!value) return "N/A";
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const getFullName = (contact: Contact) =>
  `${contact.firstName} ${contact.lastName}`;

const TableJobtitleGenerator = ({ contacts }: Props) => {
  if (!contacts.length) {
    return <p className="text-center text-gray-500">No contacts found.</p>;
  }

  return (
    <Table className="min-w-full border-collapse">
      <TableHeader className="bg-gray-900 text-white font-semibold">
        <TableRow>
          <TableHead className="py-4 px-6 text-left">Name</TableHead>
          <TableHead className="py-4 px-6 text-left">Company</TableHead>
          <TableHead className="py-4 px-6 text-left">Sector</TableHead>
          <TableHead className="py-4 px-6 text-left">Job Title</TableHead>
          <TableHead className="py-4 px-6 text-left">Email</TableHead>
          <TableHead className="py-4 px-6 text-left">Phone 1</TableHead>
          <TableHead className="py-4 px-6 text-left">Phone 2</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {contacts.map((contact) => (
          <TableRow key={`${contact.email}-${contact.jobTitle}`} className="border-b">
            <TableCell className="py-4 px-6 text-xs">{getFullName(contact)}</TableCell>
            <TableCell className="py-4 px-6 text-xs">{contact.company?.name ?? "N/A"}</TableCell>
            <TableCell className="py-4 px-6 text-xs">{formatLabel(contact.company?.sector)}</TableCell>
            <TableCell className="py-4 px-6 text-xs">{formatLabel(contact.jobTitle)}</TableCell>
            <TableCell className="py-4 px-6 text-xs">{contact.email}</TableCell>
            <TableCell className="py-4 px-6 text-xs">{contact.phone1 || "-"}</TableCell>
            <TableCell className="py-4 px-6 text-xs">{contact.phone2 || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableJobtitleGenerator;