import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const RecentActivities = async () => {
  // Obtener actividades desde la base de datos
  const campaigns = await prisma.activity.findMany({
    select: { id: true, name: true, date: true },
    orderBy: { date: "desc" },
    take: 3,
  });

  

  // Formatear datos antes de renderizar
  const activities = [
    ...campaigns.map((c) => ({ id: c.id, name: c.name, type: "Campaña", date: c.date.toISOString().split("T")[0] })),
    
  ].sort((a, b) => (a.date > b.date ? -1 : 1)); // Ordenar por fecha descendente

  return (
    <div className="bg-white p-4 rounded-lg shadow-md min-h-[30vh] flex flex-col">
      <div className="flex items-center justify-between">
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-black text-white">
            <tr>
              <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">Actividad</th>
              <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">Tipo</th>
              <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-gray-50">
                <td className="py-3 px-6">{activity.name}</td>
                <td className="py-3 px-6">{activity.type}</td>
                <td className="py-3 px-6">{activity.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentActivities;

