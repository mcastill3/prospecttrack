import prisma from "@/lib/prisma";
import Image from "next/image";

const UserCard = async ({ type }: { type: "leads" | "conversion" | "ingresos" | "contactos" }) => {
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

  if (type === "conversion") {
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
          _sum: {
            value: true, // Sumar los valores de la columna "value"
          },
        });

        // El resultado de la agregación es un objeto que contiene _sum, por lo que accedemos a _sum.value
        // Si no hay ningún valor, devolvemos 0
        const totalValue = result._sum.value ?? 0;
        
        // Formateamos el valor como EUR con separador de miles y 2 decimales
        return formatCurrency(totalValue);
      },
      contactos: () => prisma.contact.count(),
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

export default UserCard;