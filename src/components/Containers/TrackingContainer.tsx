import { PrismaClient } from '@prisma/client';
import TrackingChart from '../Charts/TrackingChart';


const prisma = new PrismaClient();

const TrackingContainer = async () => {
  // Obtener las actividades por mes
  const activities = await prisma.activity.groupBy({
    by: ['date'],
    _count: {
      id: true,
    },
    orderBy: {
      date: 'asc',
    },
  });

  // Obtener los leads por mes
  const leads = await prisma.lead.groupBy({
    by: ['createdAt'],
    _count: {
      id: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Obtener las oportunidades por mes (leads con valor > 0)
  const opportunities = await prisma.lead.groupBy({
    by: ['createdAt'],
    where: {
      value: {
        gt: 0,
      },
    },
    _count: {
      id: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Formatear los datos para que estén listos para el gráfico
  const formattedData = activities.map((activity) => {
    const month = activity.date.toISOString().slice(0, 7); // Obtener solo el mes en formato "YYYY-MM"
    const activityCount = activity._count.id;

    // Encontrar los leads y oportunidades del mismo mes
    const leadsCount = leads.filter((lead) => lead.createdAt.toISOString().slice(0, 7) === month).length;
    const opportunitiesCount = opportunities.filter((opp) => opp.createdAt.toISOString().slice(0, 7) === month).length;

    return {
      month,
      activities: activityCount,
      leads: leadsCount,
      opportunities: opportunitiesCount,
    };
  });

  return <TrackingChart data={formattedData} />;
};

export default TrackingContainer;
