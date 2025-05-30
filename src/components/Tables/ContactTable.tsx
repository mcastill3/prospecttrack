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
import { Contact } from "@/types/contact";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { Pencil, ScanSearch, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { deleteContact } from "@/app/actions/delete-contact";


const countryCodeMap: Record<string, string> = {
  Spain: "ES", France: "FR", Italy: "IT", "United States": "US", Mexico: "MX", USA: "US",
};

const getFlagImageUrl = (country: string) => {
  const code = countryCodeMap[country];
  return code
    ? `https://flagcdn.com/w40/${code.toLowerCase()}.png`
    : "https://via.placeholder.com/40x30";
};

const ContactTable = ({ contacts }: { contacts: Contact[] }) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<Contact | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const router = useRouter();

  const openEditModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <Table className="min-w-full border-collapse">
        <TableHeader className="bg-gray-900 text-white font-semibold">
          <TableRow>
            <TableHead className="py-4 px-6 text-left text-white">Name</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Email</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Organization</TableHead>
            <TableHead className="py-4 px-6 text-left text-white whitespace-nowrap">Job Title</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Phone</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Country</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">City</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {contacts.map((contact) => (
            <TableRow key={contact.id} className="hover:bg-gray-100">
              <TableCell className="py-4 px-6 text-left text-xs">{contact.firstName} {contact.lastName}</TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">{contact.email}</TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">{contact.company?.name || "N/A"}</TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">{contact.jobTitle.replace(/_/g, ' ')}</TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">{contact.phone1 || "N/A"}</TableCell>
              <TableCell className="py-4 px-6 text-left text-xs flex items-center gap-2">
                <Image
                  src={getFlagImageUrl(contact.country?.name || "UN")}
                  alt={contact.country?.name || "Unknown"}
                  width={24}
                  height={16}
                  className="rounded-sm border border-gray-300"
                />
                {contact.country?.name || "N/A"}
              </TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">{contact.city?.name || "N/A"}</TableCell>
              <TableCell className="flex items-center gap-2 px-6 py-4">
                <Link href={`/list/contact/${contact.id}`}>
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
                    onClick={() => openEditModal(contact)}
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-200 transition-colors duration-200"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button
                  onClick={() => setDeleteTarget(contact)}
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
          <p>Are you sure you want to delete this contact: <strong>{deleteTarget?.firstName} {deleteTarget?.lastName}</strong>?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={async () => {
                try {
                  await deleteContact(deleteTarget!.id);
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

export default ContactTable;