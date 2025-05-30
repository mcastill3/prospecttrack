// components/Tables/TableSectorGenerator.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone1?: string;
  phone2?: string;
  jobTitle: string;
}

interface Company {
  name: string;
  sector: string;
  contacts: Contact[];
}

const TableSectorGenerator = ({
  sector,
  onCountUpdate,
  onDataLoad,
}: {
  sector: string;
  onCountUpdate?: (count: number) => void;
  onDataLoad?: (companies: Company[]) => void;
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!sector) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/generator/companies/sector?sector=${sector}`);
        const data = await res.json();
        setCompanies(data);

        // Enviar número de contactos
        if (onCountUpdate) {
          const totalContacts = data.reduce(
            (acc: number, company: Company) => acc + (company.contacts?.length || 0),
            0
          );
          onCountUpdate(totalContacts);
        }

        // Enviar todos los datos al padre
        if (onDataLoad) {
          onDataLoad(data);
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sector]);

  if (loading) {
    return <p className="p-4">Loading companies...</p>;
  }

  if (companies.length === 0) {
    return <p className="p-4">No companies found for this sector.</p>;
  }

  const formatSector = (sector: string) => {
  return sector
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

  return (
    <Table className="min-w-full border-collapse">
      <TableHeader className="bg-gray-900 text-white font-semibold">
        <TableRow>
          <TableHead className="py-4 px-6 text-left text-white">Name</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Sector</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Contact</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Job Title</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Email</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Phone 1</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Phone 2</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {companies.map((company, i) =>
          company.contacts.map((contact, j) => (
            <TableRow key={`${i}-${j}`}>
              <TableCell className="py-3 px-6">{company.name}</TableCell>
              <TableCell className="py-3 px-6">{formatSector(company.sector)}</TableCell>
              <TableCell className="py-3 px-6">
                {contact.firstName} {contact.lastName}
              </TableCell>
              <TableCell className="py-3 px-6">{contact.jobTitle?.replace(/_/g, ' ')}</TableCell>
              <TableCell className="py-3 px-6">{contact.email}</TableCell>
              <TableCell className="py-3 px-6">{contact.phone1 || "-"}</TableCell>
              <TableCell className="py-3 px-6">{contact.phone2 || "-"}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TableSectorGenerator;