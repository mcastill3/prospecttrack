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
import { ExtendedCompany } from "@/types/company";
import { Pencil, ScanSearch, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/app/actions/delete-account";

const countryCodeMap: Record<string, string> = {
  Spain: "ES", France: "FR", Italy: "IT", "United States": "US", Mexico: "MX", USA: "US",
};

const getFlagImageUrl = (country: string) => {
  const code = countryCodeMap[country];
  return code
    ? `https://flagcdn.com/w40/${code.toLowerCase()}.png`
    : "https://via.placeholder.com/40x30";
};

const OrganizationTable = ({ companies }: { companies: ExtendedCompany[] }) => {
  const [selectedCompany, setSelectedCompany] = useState<ExtendedCompany | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExtendedCompany | null>(null);
  const router = useRouter();

  const openEditModal = (company: ExtendedCompany) => {
    setSelectedCompany(company);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (company: ExtendedCompany) => {
    setSelectedCompany(company);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <Table className="min-w-full border-collapse">
        <TableHeader className="bg-gray-900 text-white font-semibold">
          <TableRow>
            <TableHead className="py-4 px-6 text-left text-white">Name</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Sector</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Type</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Leads</TableHead>
            <TableHead className="py-4 px-6 text-left text-white whitespace-nowrap">Account Manager</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Contact</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Country</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">City</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {companies.map((company) => (
            <TableRow key={company.id} className="hover:bg-gray-100">
              <TableCell className="py-4 px-6 text-left text-xs">{company.name}</TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">
                {company.sector?.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || "N/A"}
              </TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">
                {company.classification || "N/A"}
              </TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">{company.leadCount}</TableCell>
              <TableCell className="py-4 px-6 text-left text-xs inline-table">
                {company.classification === "Enterprise" ? (
                  <span className="bg-blue-800 text-white px-2 py-1 rounded-full">
                    {company.leads && company.leads.length > 0 ? (
                      company.leads[0].accountManager ? (
                        `${company.leads[0].accountManager.firstName} ${company.leads[0].accountManager.lastName}`
                      ) : (
                        "Marketing - TBA"
                      )
                    ) : (
                      "Marketing - TBA"
                    )}
                  </span>
                ) : company.classification === "SMB" ? (
                  <span className="bg-blue-400 text-white px-2 py-1 rounded-full inline-flex">
                    {company.leads && company.leads.length > 0 ? (
                      company.leads[0].accountManager ? (
                        `${company.leads[0].accountManager.firstName} ${company.leads[0].accountManager.lastName}`
                      ) : (
                        "Marketing - TBA"
                      )
                    ) : (
                      "Marketing - TBA"
                    )}
                  </span>
                ) : (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full">
                    Marketing - TBA
                  </span>
                )}
              </TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">
                {company.contacts && company.contacts.length > 0
                  ? `${company.contacts[0].firstName} ${company.contacts[0].lastName}`
                  : "N/A"}
              </TableCell>
              <TableCell className="py-4 px-6 text-left text-xs flex items-center gap-2">
                <Image
                 src={getFlagImageUrl(company.country?.name || "UN")}
                 alt={company.country?.name || "Unknown"}
                 width={24}
                 height={16}
                 className="rounded-sm border border-gray-300"
                />
                {company.country?.name || "N/A"}
              </TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">{company.city?.name || "N/A"}</TableCell>
              <TableCell className="flex items-center gap-2 px-6 py-4">
                <Link href={`/list/organizations/${company.id}`}>
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
                    onClick={() => openEditModal(company)}
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-200 transition-colors duration-200"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button
                  onClick={() => setDeleteTarget(company)}
                  variant="ghost"
                  size="icon"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
       {/* Modal confirmación eliminar */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this account: <strong>{deleteTarget?.name}</strong>?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={async () => {
                try {
                  await deleteAccount(deleteTarget!.id);
                  toast.success('✅ Contact deleted successfully');
                  setDeleteTarget(null);
                  router.refresh();
                } catch (err) {
                  toast.error('❌ Error deleting activity');
                  console.error(err);
                }
              }}
            >
              Yes, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrganizationTable;