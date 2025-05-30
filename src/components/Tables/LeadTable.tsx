"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Lead } from "@/types/leads";
import { Pencil, ScanSearch, Trash2 } from "lucide-react";


const LeadTable = ({ leads }: { leads: Lead[] }) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openEditModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  const formatCurrency = (value: number): string => {
  return `€ ${value.toLocaleString()}`;
};


  return (
    <>
      <Table className="min-w-full border-collapse">
        <TableHeader className="bg-gray-900 text-white font-semibold">
          <TableRow>
            <TableHead className="py-4 px-6 text-left text-white">Name</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Source</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Creation Date</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Status</TableHead>
            <TableHead className="py-4 px-6 text-left text-white whitespace-nowrap">Account Manager</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Last contact</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Estimated Value</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
        {leads.map((lead) => (
          <TableRow key={lead.id} className="hover:bg-gray-300">
            <TableCell className="py-4 px-6 text-left text-xs">{lead.name}</TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">
            {lead.activity
              ? `${lead.activity.type} on ${new Date(lead.activity.date).toLocaleDateString()}`
              : "No Activity"}
            </TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">
              {new Date(lead.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="py-4 px-6 text-left text-xs capitalize">
              {lead.status.toLowerCase()}
            </TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">
              {lead.accountManager
                ? `${lead.accountManager.firstName} ${lead.accountManager.lastName}`
                : "Marketing - TBA"}
            </TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">
              {new Date(lead.updatedAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">
              {lead.value ? formatCurrency(lead.value) : "€ 0"}
            </TableCell>
            <TableCell className="flex items-center gap-2 px-6 py-4">
              {/* Ejemplo de acciones */}
              <Link href={`/list/lead/${lead.id}`}>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-200 transition-colors duration-200"
                    aria-label="Edit"
                  >
                    <ScanSearch className="h-4 w-4 text-muted-foreground" />
                </Button>
              </Link>
              <Button
                    onClick={() => openEditModal(lead)}
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-200 transition-colors duration-200"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button
                    onClick={() => openDeleteModal(lead)}
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-200 transition-colors duration-200"
                    aria-label="Edit"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      </Table>
    </>
  );
};

export default LeadTable;