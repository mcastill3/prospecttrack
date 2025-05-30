"use client";

import { useState } from "react";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from "@/components/ui/table"; // asegúrate que estos existan
import Link from "next/link";
import { Button } from "../ui/button";
import { ActivityWithLeads } from "@/types/activity";
import { Pencil, ScanSearch, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { deleteActivity } from "@/app/actions/delete-activity";
import ActivityFormEdit from "../forms/Modal/ActivityFormEdit";
import { ActivityType } from "@/lib/formValidationSchema";

// Paso clave: función para convertir ActivityWithLeads a ActivityFormEdit-friendly
function mapActivityForForm(activity: ActivityWithLeads) {
  return {
    ...activity,
    name: activity.name ?? undefined,
    areaId: activity.area?.id ?? undefined,
    // más campos si hace falta limpiar nulls
    type: activity.type as ActivityType,
  };
}

const ActivityTable = ({ activities }: { activities: ActivityWithLeads[] }) => {
  const [editActivity, setEditActivity] = useState<ReturnType<typeof mapActivityForForm> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ActivityWithLeads | null>(null);
  const router = useRouter();

  const openEditModal = (activity: ActivityWithLeads) => {
    setEditActivity(mapActivityForForm(activity));
  };

  const closeEditModal = () => {
    setEditActivity(null);
  };

  return (
    <>
      <Table className="min-w-full border-collapse">
        <TableHeader className="bg-gray-900 text-white font-semibold">
          <TableRow>
            <TableHead className="py-4 px-6 text-left text-white">Name</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Type</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Date</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Invited</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Attendees</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Area</TableHead>           
            <TableHead className="py-4 px-6 text-left text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {activities.map((activity) => (
            <TableRow key={activity.id} className="hover:bg-gray-100">
              <TableCell className="py-4 px-6 text-left text-xs">{activity.name}</TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">{activity.type.replace(/_/g, " ")}</TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">{new Date(activity.date).toLocaleDateString()}</TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">{activity.targetContacts}</TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">{activity.attendees ?? "N/A"}</TableCell>
              <TableCell className="py-4 px-6 text-left text-xs">
                {activity.area?.name ? activity.area.name.replace(/_/g, " ") : "N/A"}
              </TableCell>
              <TableCell className="flex items-center gap-2 px-6 py-4">
                <Link href={`/list/campaign/${activity.id}`}>
                  <Button variant="ghost" size="icon" aria-label="View">
                    <ScanSearch className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </Link>
                <Button
                  onClick={() => openEditModal(activity)}
                  variant="ghost"
                  size="icon"
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                </Button>
                {editActivity && (
                  <ActivityFormEdit
                    activity={editActivity}
                    onClose={closeEditModal}
                  />
                )}
                <Button
                  onClick={() => setDeleteTarget(activity)}
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
          <p>Are you sure you want to delete this activity: <strong>{deleteTarget?.name}</strong>?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={async () => {
                try {
                  await deleteActivity(deleteTarget!.id);
                  toast.success('✅ Activity deleted successfully');
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

export default ActivityTable;