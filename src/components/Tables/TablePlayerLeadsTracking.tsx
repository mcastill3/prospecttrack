import prisma from "@/lib/prisma";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

const getPlayerLeadsTracking = async (playerId: string) => {
  const now = new Date();
  const monthlyGoal = 10; // 🎯 Meta dinámica si lo deseas

  // Generar rangos de fecha para los últimos 6 meses
  const months = Array.from({ length: 4 }, (_, i) => {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    return { start, end };
  });

  // Obtener los leads de cada mes
  const leadsData = await Promise.all(
    months.map(async ({ start, end }) => {
      const count = await prisma.lead.count({
        where: {
          players: { some: { id: playerId } },
          createdAt: { gte: start, lte: end },
        },
      });
      return { month: start, leads: count };
    })
  );

  return { leadsData, monthlyGoal };
};

const TablePlayerLeadsTracking = async ({ playerId }: { playerId: string }) => {
  const { leadsData, monthlyGoal } = await getPlayerLeadsTracking(playerId);

  // Determinar la tendencia 📈📉 comparando cada mes con el anterior
  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowUp className="text-green-500" />;
    if (current < previous) return <ArrowDown className="text-red-500" />;
    return <Minus className="text-gray-500" />;
  };

  // Determinar color según rendimiento
  const getColor = (leads: number) => {
    if (leads < monthlyGoal * 0.5) return "text-red-500"; // Menos del 50%
    if (leads < monthlyGoal) return "text-yellow-500"; // Entre 50% y 100%
    return "text-green-500"; // Mayor a 100%
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <h2 className="text-xl font-semibold text-gray-700 text-center">📊 Seguimiento de Leads</h2>
      <table className="w-full text-sm text-gray-700 mt-2">
        <thead>
          <tr className="border-b">
            <th className="py-2">Mes</th>
            <th className="py-2">Leads</th>
            <th className="py-2">Tendencia</th>
          </tr>
        </thead>
        <tbody>
          {leadsData.map((data, index) => {
            const prevLeads = index < leadsData.length - 1 ? leadsData[index + 1].leads : data.leads;
            return (
              <tr key={index} className="border-b">
                <td className="py-2">
                  📅 {new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(data.month)}
                </td>
                <td className={`py-2 font-semibold ${getColor(data.leads)}`}>
                  {data.leads}
                </td>
                <td className="py-2">{getTrendIcon(data.leads, prevLeads)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TablePlayerLeadsTracking;