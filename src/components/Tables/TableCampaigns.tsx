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

const CampaignsTable = async () => {
  // Obtener las campañas de la base de datos, ordenadas por fecha ascendente
  const campaigns = await prisma.activity.findMany({
     take: 5,
    orderBy: {
      date: "asc",
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Campaigns</h1>
        <button className="text-sm text-blue-600 hover:underline">View All</button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table className="min-w-full border-collapse">
          {/* Cabecera */}
          <TableHeader className="bg-gray-900 text-white font-semibold">
            <TableRow>
              <TableHead className="py-4 px-6 text-left font-semibold text-white">Name</TableHead>
              <TableHead className="py-4 px-6 text-left font-semibold text-white">Launch Date</TableHead>
              <TableHead className="py-4 px-6 text-left font-semibold text-white">Status</TableHead>
              <TableHead className="py-4 px-6 text-left font-semibold text-white">Type</TableHead>
            </TableRow>
          </TableHeader>

          {/* Cuerpo */}
          <TableBody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <TableRow
                key={campaign.id}
                className="hover:bg-gray-200 transition-all duration-200"
              >
                <TableCell className="py-3 px-6 text-gray-900 font-medium">
                  Type
                </TableCell>
                <TableCell className="py-3 px-6 text-gray-800">
                  {campaign.date.toLocaleDateString()}
                </TableCell>
                
                <TableCell className="py-3 px-6 text-gray-800">
                  {campaign.type.replace(/_/g, " ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CampaignsTable;