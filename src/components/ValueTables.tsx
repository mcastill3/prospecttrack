import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ValuesTable = async () => {
  // Obtener los costos de la base de datos
  const costs = await prisma.cost.findMany();

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Cost Table</h1>
        <span className="text-sm text-gray-500 cursor-pointer">View All</span>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-black">
            <tr>
              <th className="py-4 px-6 text-left  text-white font-semibold uppercase tracking-wider">Tipo</th>
              <th className="py-4 px-6 text-left  text-white font-semibold uppercase tracking-wider">Cantidad</th>
              <th className="py-4 px-6 text-left  text-white font-semibold uppercase tracking-wider">Moneda</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {costs.map((cost) => (
              <tr key={cost.id} className="hover:bg-gray-50">
                <td className="py-3 px-6 text-gray-800">{cost.type}</td>
                <td className="py-3 px-6 text-gray-800">€{cost.amount}</td>
                <td className="py-3 px-6 text-gray-800">{cost.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValuesTable;