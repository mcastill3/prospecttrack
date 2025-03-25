import { PrismaClient } from '@prisma/client';
import AttendanceChart from './Charts/AttendanceChart';
import Image from 'next/image';

const prisma = new PrismaClient();

// Definir el tipo para los datos combinados
type CombinedData = {
  name: string;
  campaigns: number;
  events: number;
};

// Función asincrónica que obtiene las campañas por mes (sin tener en cuenta el día)
export const getCampaignsByMonth = async () => {
  const campaignsByMonth = await prisma.campaign.groupBy({
    by: ['date'],
    _count: {
      id: true,
    },
    where: {
      date: {
        gte: new Date('2025-01-01'),
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  // Agrupar solo por mes y año (ignorar el día)
  return campaignsByMonth.map((item) => {
    const monthYear = item.date.toISOString().substring(0, 7); // Formato YYYY-MM
    return {
      month: monthYear,
      campaigns: item._count.id,
    };
  });
};

// Función asincrónica que obtiene los eventos por mes (sin tener en cuenta el día)
export const getEventsByMonth = async () => {
  const eventsByMonth = await prisma.event.groupBy({
    by: ['date'],
    _count: {
      id: true,
    },
    where: {
      date: {
        gte: new Date('2025-01-01'),
      },
    },
    orderBy: {
      date: 'asc',
    },
  });

  // Agrupar solo por mes y año (ignorar el día)
  return eventsByMonth.map((item) => {
    const monthYear = item.date.toISOString().substring(0, 7); // Formato YYYY-MM
    return {
      month: monthYear,
      events: item._count.id,
    };
  });
};

const AttendanceChartContainer = async () => {
  // Obtener los datos por separado
  const campaignsData = await getCampaignsByMonth();
  const eventsData = await getEventsByMonth();

  // Unificar los datos de campañas y eventos en base al mes y año
  const combinedData: CombinedData[] = [];

  // Unificar campañas
  campaignsData.forEach((campaign) => {
    const existingMonth = combinedData.find((data) => data.name === campaign.month);
    if (existingMonth) {
      existingMonth.campaigns += campaign.campaigns; // Sumar las campañas
    } else {
      combinedData.push({
        name: campaign.month,
        campaigns: campaign.campaigns,
        events: 0, // Inicializar con 0 eventos
      });
    }
  });

  // Unificar eventos
  eventsData.forEach((event) => {
    const existingMonth = combinedData.find((data) => data.name === event.month);
    if (existingMonth) {
      existingMonth.events += event.events; // Sumar los eventos
    } else {
      combinedData.push({
        name: event.month,
        campaigns: 0, // Inicializar con 0 campañas
        events: event.events,
      });
    }
  });

  const title = `Activities monthly report - ${new Date().getFullYear()}`; // Título con el año actual

  return (
    <div className="rounded-xl w-full h-full bg-white">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold ml-2">{title}</h1> {/* Título con el año */}
        <Image
          src="/moreDark.png"
          alt=""
          width={20}
          height={20}
          className="cursor-pointer mr-2"
        />
      </div>

      {/* Pasar los datos combinados */}
      <AttendanceChart data={combinedData} />
    </div>
  );
};

export default AttendanceChartContainer;