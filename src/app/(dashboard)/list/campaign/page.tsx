import ActivityFilter from '@/components/Filters/ActivityFilter';
import Pagination from '@/components/Pagination';
import ActivityTable from '@/components/Tables/ActivityTable';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { ActivityType, ExecutionStatus } from '@prisma/client';  // Asegúrate de importar los tipos correctos
import prisma from '@/lib/prisma';
import ActivityFormCreate from '@/components/forms/Modal/ActivityFormCreate';


const ActivityListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const page = parseInt(searchParams.page || '1', 10);
  const startIndex = (page - 1) * ITEM_PER_PAGE;

  // Convertir los parámetros a los tipos correctos de las enumeraciones
  const type = searchParams.type ? (searchParams.type as ActivityType) : undefined;
  const status = searchParams.status ? (searchParams.status as ExecutionStatus) : undefined;
  const areaId = searchParams.areaId;
  const rawStartDate = searchParams.startDate;
  const rawEndDate = searchParams.endDate;
  const startDate = rawStartDate ? new Date(rawStartDate) : undefined;
  const endDate = rawEndDate ? new Date(rawEndDate) : undefined;

  // Consulta a la base de datos con filtros dinámicos
  const [activities, totalCount] = await Promise.all([
    prisma.activity.findMany({
      where: {
        
        ...(type && { type }),
        ...(type && { type }),  // Filtro por tipo de actividad (usando ActivityType enum)
        ...(status && { status }),  // Filtro por estado (usando ExecutionStatus enum)
        ...(areaId && { areaId }),  // Filtro por área
        ...(startDate && endDate && {
          date: {
            gte: startDate,
            lte: endDate,
          }
        }),
        ...(startDate && !endDate && {
          date: {
            gte: startDate,
          }
        }),
        ...(endDate && !startDate && {
          date: {
            lte: endDate,
          }
        }),
      },
      include: {
        leads: {
          select: {
            id: true,
            name: true,
            value: true,
            accountManager: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            contact: {
              select: {
                firstName: true,
                lastName: true,
                jobTitle: true,
              },
            },
            company: {
              select: {
                id: true,
                name: true,
                revenue: true,
              },
            },
          },
        },
         area: {
          select: {
            id: true,
            name: true,
          },
        },
        cost: {
          select: {
            id: true,
            name: true,
            amount: true,
            currency: true,
          },
        },
      },
      skip: startIndex,
      take: ITEM_PER_PAGE,
      orderBy: { date: 'desc' },
    }),
    prisma.activity.count({
      where: {
        ...(type && { type }),  // Filtro por tipo de actividad (usando ActivityType enum)
        ...(status && { status }),
        ...(areaId && { areaId }),
        ...(startDate && { date: { gte: startDate } }),
        ...(endDate && { date: { lte: endDate } }),
      },
    }),
  ]);

  const areas = await prisma.area.findMany({
    select: { id: true, name: true },
  });

  return (
    <div className="mt-10 rounded-lg shadow">
      <ActivityFilter areas={areas} totalCount={totalCount} />
      <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-300 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">Activities</h2>
          <ActivityFormCreate selectedContactIds={[]} />
      </div>
      <div className="bg-white p-4 rounded-b-lg">
        <ActivityTable activities={activities} />
        <Pagination page={page} count={totalCount} />
      </div>
    </div>
  );
};

export default ActivityListPage;