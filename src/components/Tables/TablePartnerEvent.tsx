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

const TablePartnerEvent = async ({ partnerId }: { partnerId: string }) => {

        // Obtener eventos en los que el partner está involucrado
        const events = await prisma.event.findMany({
          where: {
            sponsors: {
              some: {
                id: partnerId, // Filtrar eventos donde el Partner sea sponsor
              },
            },
          },
          orderBy: {
            date: "desc",
          },
          take: 5, // Limitar a los últimos 5 eventos
        });
      
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            {/* Encabezado */}
            <div className="flex items-center justify-between mb-6 border-b pb-4">
              <h1 className="text-2xl font-semibold text-gray-800">Eventos Asociados</h1>
              <button className="text-sm text-blue-600 hover:underline">Ver Todos</button>
            </div>
      
            {/* Tabla */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <Table className="min-w-full border-collapse">
                {/* Cabecera */}
                <TableHeader className="bg-gray-900 text-white font-semibold">
                  <TableRow>
                    <TableHead className="py-4 px-6 text-left font-semibold text-white">Nombre</TableHead>
                    <TableHead className="py-4 px-6 text-left font-semibold text-white">Fecha</TableHead>
                    <TableHead className="py-4 px-6 text-left font-semibold text-white">Estado</TableHead>
                    <TableHead className="py-4 px-6 text-left font-semibold text-white">Tipo</TableHead>
                  </TableRow>
                </TableHeader>
      
                {/* Cuerpo */}
                <TableBody className="bg-white divide-y divide-gray-200">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <TableRow key={event.id} className="hover:bg-gray-200 transition-all duration-200">
                        <TableCell className="py-3 px-6 text-gray-900 font-medium">{event.name}</TableCell>
                        <TableCell className="py-3 px-6 text-gray-800">{new Date(event.date).toLocaleDateString()}</TableCell>
                        <TableCell className="py-3 px-6 text-gray-800">{event.status.replace(/_/g, " ")}</TableCell>
                        <TableCell className="py-3 px-6 text-gray-800">{event.type.replace(/_/g, " ")}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="py-4 px-6 text-center text-gray-500">
                        No hay eventos asociados para este partner.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        );
      };
      

export default TablePartnerEvent;