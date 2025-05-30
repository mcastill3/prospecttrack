"use client";

import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";  // Asegúrate de que estos componentes sean los correctos de shadcn/ui
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button"; 
import { ActivityWithLeads } from "@/types/activity";


const ActivityTable = ({ activities }: { activities: ActivityWithLeads[] }) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityWithLeads | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const openEditModal = (activity: ActivityWithLeads) => {
    setSelectedActivity(activity);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (activity: ActivityWithLeads) => {
    setSelectedActivity(activity);
    setIsDeleteModalOpen(true);
  };

  function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'symbol'
  }).format(amount);
}

  return (
    <>
      <Table className="min-w-full border-collapse">
        <TableHeader className="bg-gray-900 text-white font-semibold">
          <TableRow>
            <TableHead className="py-4 px-6 text-left text-white">Name</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Type</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Date</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Status</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Attendees</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Follow Up</TableHead>            
            <TableHead className="py-4 px-6 text-left text-white">Cost</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {activities.map((activity) => (
            <TableRow key={activity.id} className="hover:bg-gray-100">
              <TableCell className="py-4 px-6 text-left text-xs">
                {activity.leads.length > 0 ? (
                  activity.leads.map((lead) => lead.name).join(", ")
                ) : (
                  "No Leads"
                )}
              </TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">{activity.type}</TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">
                {new Date(activity.date).toLocaleDateString()}
              </TableCell>
              
              <TableCell className="py-4 px-6 text-left text-xs">{activity.attendees ?? "N/A"}</TableCell>
                            
              <TableCell className="py-4 px-6 text-left text-xs">
                {activity.cost ? formatCurrency(activity.cost.amount) : "N/A"}
              </TableCell>
              <TableCell className="flex items-center gap-2 px-6 py-4">
                {/* Ejemplo de acciones */}
                <Link href={`/list/campaign/${activity.id}`}>
                  <Button className="bg-[#D1D5DB] rounded-full p-0 h-8 w-8 flex items-center justify-center">
                    <Image src="/view.png" alt="View" width={18} height={18} />
                  </Button>
                </Link>
                <Button
                  onClick={() => openEditModal(activity)}
                  className="bg-[#D1D5DB] rounded-full p-0 h-8 w-8 flex items-center justify-center"
                >
                  <Image src="/edit.png" alt="Edit" width={18} height={18} />
                </Button>
                <Button
                  onClick={() => openDeleteModal(activity)}
                  className="bg-[#D1D5DB] rounded-full p-0 h-8 w-8 flex items-center justify-center"
                >
                  <Image src="/delete.png" alt="Delete" width={18} height={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ActivityTable;