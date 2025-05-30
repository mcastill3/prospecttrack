import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const UserCardDirectorCom = async ({
  type,
}: {
  type: "activities" | "leads" | "accounts" | "contacts" | "pipeline";
}) => {
  let data: number | string = 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Obtener la última actividad, tipo y asistentes
  const getLastActivity = async () => {
    const lastActivity = await prisma.activity.findFirst({
      orderBy: {
        date: "desc", // Ordena por fecha descendente para obtener la última actividad
      },
      select: {
        type: true, // Tipo de actividad
        attendees: true, // Número de asistentes
        date: true, // Fecha de la actividad
      },
    });
    return lastActivity;
  };

  // Mapa de modelos para manejar diferentes tipos
  const modelMap = {
    activities: async () => {
      const lastActivity = await getLastActivity();
      return lastActivity
        ? `${lastActivity.type} - ${lastActivity.attendees} Attendees`
        : "No Activities";
    },
    leads: async () => prisma.lead.count(),
    accounts: async () => prisma.company.count(),
    contacts: async () => prisma.contact.count(),
    pipeline: async () => {
      const result = await prisma.lead.aggregate({
        _sum: { value: true },
      });
      return formatCurrency(result._sum.value ?? 0);
    },
  } as const;

  try {
    // Obtener los datos según el tipo
    data = await modelMap[type]();
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    // Desconectar siempre al finalizar las operaciones
    await prisma.$disconnect();
  }

  // Mapa de etiquetas para mostrar el nombre adecuado
  const labelMap = {
    activities: "Activities",
    leads: "Leads",
    accounts: "Accounts",
    contacts: "Contacts",
    pipeline: "Pipeline",
  };

  const currentYear = new Date().getFullYear();

  const linkHref = `/director_comercial/details/${type}`;

  return (
    <Card className="py-2 px-3 flex gap-4 w-[24%] flex-1 min-w-[220px] h-[180px] relative bg-white shadow-md">
      <CardContent className="flex flex-col gap-3 p-0">
        <h1 className="text-sm text-gray-700 font-semibold text-left w-full">
          {labelMap[type]}
        </h1>
        <h1 className="text-sm text-gray-400 font-semibold text-left w-full flex items-center space-x-2">{data}</h1>
        
        {/* Mostrar el año actual */}
        <div className="text-sm mt-2 bg-blue-700 text-center text-white font-semibold rounded-full hover:bg-slate-400 inline-block px-2 py-1">
          {currentYear}
        </div>

        <div className="absolute right-4 bottom-6">
          <Image
            src="/logo.png"
            alt="Logo"
            width={48}
            height={48}
            className="rounded-full border-2 border-white"
          />
        </div>
      </CardContent>

      <div className="absolute bottom-0 left-0 w-full h-[8px] flex rounded-xl overflow-hidden">
        <div className="w-[70%] h-full bg-[#6900EE]"></div>
        <div className="w-[30%] h-full bg-black"></div>
      </div>
    </Card>
  );
};

export default UserCardDirectorCom;