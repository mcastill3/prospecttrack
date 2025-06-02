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

import { AccountManager } from "@/types/aacountManager";
import { deleteAccountManager } from "@/app/actions/delete-account-manager";


const countryCodeMap: Record<string, string> = {
  Spain: "ES", France: "FR", Italy: "IT", "United States": "US", Mexico: "MX", USA: "US",
};

const getFlagImageUrl = (country: string) => {
  const code = countryCodeMap[country];
  return code
    ? `https://flagcdn.com/w40/${code.toLowerCase()}.png`
    : "https://via.placeholder.com/40x30";
};

const AccountManagerTable = ({ managers }: { managers: AccountManager[] }) => {
  const [selectedManager, setSelectedManager] = useState<AccountManager | null>(null);
   const [deleteTarget, setDeleteTarget] = useState<AccountManager | null>(null);
  
  const router = useRouter();

  
  return (
    <>
      <Table className="min-w-full border-collapse">
        <TableHeader className="bg-gray-900 text-white font-semibold">
          <TableRow>
            <TableHead className="py-4 px-6 text-left text-white">Name</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Area</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Country</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">City</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {managers.map((manager) => (
          <TableRow key={manager.id}>
            <TableCell>{manager.firstName} {manager.lastName}</TableCell>
            <TableCell>{manager.area?.name || "N/A"}</TableCell>
            <TableCell className="flex items-center gap-2">
              <Image
                src={getFlagImageUrl(manager.country?.name || "UN")}
                alt={manager.country?.name || "Unknown"}
                width={24}
                height={16}
                className="rounded-sm border border-gray-300"
              />
              {manager.country?.name || "N/A"}
            </TableCell>
            <TableCell>{manager.city?.name || "N/A"}</TableCell>
            <TableCell>
              <Button
                onClick={() => setSelectedManager(manager)}
                variant="ghost"
                size="icon"
              >
                <Pencil className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button
                onClick={() => setDeleteTarget(manager)}
                variant="ghost"
                size="icon"
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
                  await deleteAccountManager(deleteTarget!.id);
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

export default AccountManagerTable;