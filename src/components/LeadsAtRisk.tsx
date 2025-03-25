import { PrismaClient } from "@prisma/client";
import classNames from "classnames";

const prisma = new PrismaClient();

const getLeadsAtRiskFromDatabase = async () => {
  const now = new Date();
  const fiveDaysAgo = new Date(now);
  fiveDaysAgo.setDate(now.getDate() - 5);
  const tenDaysAgo = new Date(now);
  tenDaysAgo.setDate(now.getDate() - 10);

  return await prisma.lead.findMany({
    where: { status: { notIn: ["CLOSED"] } },
    orderBy: { updatedAt: "asc" },
    take: 5,
    include: { company: true },
  });
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
};

const getRiskLevel = (updatedAt: Date) => {
  const now = new Date();
  const daysDifference = Math.floor((now.getTime() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24));

  if (daysDifference > 10) return { label: "Alto", color: "bg-red-600 text-white animate-pulse" };
  if (daysDifference > 5) return { label: "Moderado", color: "bg-yellow-500 text-black" };
  return { label: "Bajo", color: "bg-green-500 text-white" };
};

const LeadsAtRisk = async () => {
  const leads = await getLeadsAtRiskFromDatabase();
  const totalValueAtRisk = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border min-h-[30vh] flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Leads en Riesgo</h2>

      <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 flex justify-between items-center shadow">
        <span className="text-lg font-semibold">Total en Riesgo:</span>
        <span className="text-xl font-bold">{formatCurrency(totalValueAtRisk)}</span>
      </div>

      <div className="overflow-x-auto flex-grow">
        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="py-3 px-4 text-left font-semibold uppercase">Lead</th>
              <th className="py-3 px-4 text-left font-semibold uppercase">Empresa</th>
              <th className="py-3 px-4 text-left font-semibold uppercase">Industria</th>
              <th className="py-3 px-4 text-left font-semibold uppercase">Última Actualización</th>
              <th className="py-3 px-4 text-left font-semibold uppercase">Valor (€)</th>
              <th className="py-3 px-4 text-left font-semibold uppercase">Riesgo</th>
              <th className="py-3 px-4 text-left font-semibold uppercase">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {leads.map((lead) => {
              const risk = getRiskLevel(lead.updatedAt);
              return (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{lead.name}</td>
                  <td className="py-3 px-4">{lead.company?.name || "N/A"}</td>
                  <td className="py-3 px-4">{lead.company?.industry || "Desconocida"}</td>
                  <td className="py-3 px-4">{new Date(lead.updatedAt).toISOString().split("T")[0]}</td>
                  <td className="py-3 px-4 font-semibold">{formatCurrency(lead.value || 0)}</td>
                  <td className="py-3 px-4">
                    <span className={classNames("px-3 py-1 rounded-md font-semibold", risk.color)}>
                      {risk.label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                      Contactar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsAtRisk;