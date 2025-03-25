import prisma from "@/lib/prisma";
import Image from "next/image";

const UserCardAdmin = async ({ type }: { type: "campaigns" | "events" | "leads" | "contacts" }) => {
  let data: number | string = 0;

  // Función para formatear el número
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2, // Para asegurar dos decimales
      maximumFractionDigits: 2, // Para asegurar dos decimales
    }).format(value);
  };

  if (type === "campaigns") {
    // Contar campañas creadas
    const totalCampaigns = await prisma.campaign.count();

    // Contar leads que provienen de campañas
    const totalLeads = await prisma.lead.count({
      where: {
        campaignId: { not: null } // Solo leads vinculados a campañas
      }
    });

    // Evitar división por cero
    const conversionRate = totalCampaigns > 0 ? (totalLeads / totalCampaigns) * 100 : 0;

    // Redondear la tasa de conversión a un número entero
    data = Math.round(conversionRate) + "%";
  } else {
    // Definición de modelMap
    const modelMap = {
      leads: () => prisma.lead.count(),
      ingresos: async () => {
        const result = await prisma.lead.aggregate({
          _sum: { value: true },
        });
        return formatCurrency(result._sum.value ?? 0);
      },
      contacts: () => prisma.contact.count(),
      events: () => prisma.event.count(), // ✅ Agregar "events"
    } as const;

    // Llamar al modelo correspondiente y asegurar que la variable data sea un número
    data = await modelMap[type]();
  }

  return (
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaSky p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <Image src="/more.png" alt="" width={20} height={20} className="cursor-pointer" />
      </div>
      <h1 className="text-2xl font-semibold my-4 text-white">{data}</h1>
      <h2 className="capitalize text-sm font-medium text-white">{type}</h2>
    </div>
  );
};

export default UserCardAdmin;