import prisma from '@/lib/prisma';
import Pagination from '@/components/Pagination';
import LeadTable from '@/components/Tables/LeadTable';
import { ITEM_PER_PAGE } from '@/lib/settings';
import LeadFilter from '@/components/Filters/LeadFilter';
import OpenCreateModalButton from '@/components/button/OpenCreateModalButton';
import LeadFormModal from '@/components/forms/Modal/LeadFormModal';
import LeadModalForm from '@/components/forms/Modal/LeadFormModal';
import LeadFormCreate from '@/components/forms/Modal/LeadFormCreate';

const LeadListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const page = parseInt(searchParams.page || "1", 10);
  const startIndex = (page - 1) * ITEM_PER_PAGE;
  

  const {
    name,
    accountManager,
    status,
    source,
    startDate,
    endDate,
  } = searchParams;

const activitiesRaw = await prisma.activity.findMany({
  select: { id: true, name: true, areaId: true }, // <-- agregamos areaId aquí
  orderBy: { name: 'asc' },
});

const activities = activitiesRaw.map((a) => ({
  id: a.id,
  name: a.name ?? '',
  areaId: a.areaId ?? null, // o '' si prefieres
}));

const countries = await prisma.country.findMany({
  select: { id: true, name: true },
  orderBy: { name: 'asc' },
});

const cities = await prisma.city.findMany({
  select: { id: true, name: true, countryId: true },
  orderBy: { name: 'asc' },
});

const accountManagers = await prisma.accountManager.findMany({
  select: { id: true, firstName: true, lastName: true },
  orderBy: { lastName: 'asc' },
});

const areas = await prisma.area.findMany({
  select: { id: true, name: true },
});


  const where: any = {};

  if (name) {
    where.OR = [
      { contact: { firstName: { contains: name, mode: 'insensitive' } } },
      { contact: { lastName: { contains: name, mode: 'insensitive' } } },
    ];
  }

  if (accountManager) {
    where.accountManager = {
      OR: [
        { firstName: { contains: accountManager, mode: 'insensitive' } },
        { lastName: { contains: accountManager, mode: 'insensitive' } },
      ],
    };
  }

  if (status) {
    where.status = status;
  }

  if (source) {
    where.activity = {
      type: source,
    };
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) {
      where.createdAt.gte = new Date(startDate);
    }
    if (endDate) {
      where.createdAt.lte = new Date(endDate);
    }
  }

  const leads = await prisma.lead.findMany({
    where,
    include: {
      accountManager: { select: { firstName: true, lastName: true } },
      contact: { select: { firstName: true, lastName: true } },
      company: { select: { id: true, name: true, revenue: true } },
      activity: { select: { id: true, type: true, date: true } },
    },
    skip: startIndex,
    take: ITEM_PER_PAGE,
    orderBy: { createdAt: 'desc' },
  });

  const totalCount = await prisma.lead.count({ where });

  const enterpriseCount = await prisma.lead.count({
    where: {
      ...where,
      company: { revenue: { gt: 250_000_000 } },
    },
  });

  const smbCount = await prisma.lead.count({
    where: {
      ...where,
      company: { revenue: { lte: 250_000_000 } },
    },
  });

  

  return (
    <>
      <div className="mt-10 rounded-lg shadow">
        <LeadFilter totalCount={totalCount} />
        <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-300 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700">Leads</h2>
            <LeadFormCreate
              activities={activities}
              countries={countries}
              cities={cities}
              accountManagers={accountManagers}
              areas={areas}
            />

        </div>
        <div className="bg-white p-4 rounded-b-lg">
          
          <LeadTable leads={leads} />
          <Pagination page={page} count={totalCount} />
        </div>
      </div>
    </>
  );
};

export default LeadListPage;