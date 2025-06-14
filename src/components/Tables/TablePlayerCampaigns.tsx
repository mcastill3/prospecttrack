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

const TablePlayerCampaigns = async ({ playerId }: { playerId: string }) => {
  // Obtener campañas en las que el jugador está involucrado
  const campaigns = await prisma.activity.findMany({
    where: {
      players: {
        some: { id: playerId }, // Filtra campañas donde el jugador está asignado
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Player Campaigns</h1>
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
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <TableRow key={campaign.id} className="hover:bg-gray-200 transition-all duration-200">
                  <TableCell className="py-3 px-6 text-gray-900 font-medium">{campaign.name}</TableCell>
                  <TableCell className="py-3 px-6 text-gray-800">{campaign.date.toLocaleDateString()}</TableCell>
                  
                  <TableCell className="py-3 px-6 text-gray-800">{campaign.type.replace(/_/g, " ")}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-4 px-6 text-center text-gray-500">
                  No campaigns found for this player.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TablePlayerCampaigns;