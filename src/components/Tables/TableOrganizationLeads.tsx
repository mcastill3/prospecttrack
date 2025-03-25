import prisma from "@/lib/prisma"; // Usa la instancia de Prisma existente
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TableOrganizationLeads = async ({ companyId }: { companyId: string }) => {
  // Obtener los leads asociados a la empresa
  const leads = await prisma.lead.findMany({
    where: {
      companyId: companyId, // Usar la variable correcta
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
    include: {
      company: true, // Incluir los datos de la empresa para evitar errores en el renderizado
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4 border-b pb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Organization Leads</h1>
        <button className="text-sm text-blue-600 hover:underline">View All</button>
      </div>
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
            {leads.length > 0 ? (
              leads.map((lead) => (
                <TableRow key={lead.id} className="hover:bg-gray-200 transition-all duration-200">
                  <TableCell className="py-3 px-6 text-gray-900 font-medium">
                    {lead.name}
                  </TableCell>
                  <TableCell className="py-3 px-6 text-gray-800">
                    {lead.company?.name || "No asignado"}
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  No leads found for this organization.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableOrganizationLeads;

