import { PrismaClient } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const prisma = new PrismaClient();

const TableContactLeads = async ({ contactId }: { contactId: string }) => {
  // Obtener los leads asociados al jugador
  const leads = await prisma.lead.findMany({
    where: {
      contactId: contactId, // Filtrar por el ID del contacto
    },
    include: {
      company: true, // Incluir datos de la compañía
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-800">Contact Leads</h1>
      <div className="overflow-x-auto rounded-lg border border-gray-200 mt-4">
        <Table className="min-w-full border-collapse">
          <TableHeader className="bg-gray-900 text-white font-semibold">
            <TableRow>
              <TableHead className="py-4 px-6 text-left font-semibold text-white">Name</TableHead>
              <TableHead className="py-4 px-6 text-left font-semibold text-white">Client</TableHead>
              <TableHead className="py-4 px-6 text-left font-semibold text-white">Status</TableHead>
              <TableHead className="py-4 px-6 text-left font-semibold text-white">Amount (€)</TableHead>
              <TableHead className="py-4 px-6 text-left font-semibold text-white">Created At</TableHead>
            </TableRow>
          </TableHeader>
            <TableBody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                    <TableRow key={lead.id} className="hover:bg-gray-200 transition-all duration-200">
                    <TableCell className="py-3 px-6 text-gray-900 font-medium">
                        {lead.name}
                    </TableCell>
                    <TableCell className="py-3 px-6 text-gray-800">
                        {lead.company ? lead.company.name : "No asignado"}
                    </TableCell>
                    <TableCell className="py-3 px-6 text-gray-800">
                        {lead.status.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell className="py-3 px-6 text-gray-800">
                        {lead.value?.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </TableCell>
                    <TableCell className="py-3 px-6 text-gray-800">
                        {new Date(lead.createdAt).toLocaleDateString()}
                    </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableContactLeads;
