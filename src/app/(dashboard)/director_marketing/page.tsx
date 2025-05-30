import ColdHotContainer from '@/components/Containers/ColdHotContainer'
import CompanyChartContainer from '@/components/Containers/CompanyChartContainer'
import FunnelRealContainer from '@/components/Containers/FunnelRealContainer'
import HeatmapActivityContainer from '@/components/Containers/HeatmapActivityContainer'
import HeatmapSectorContainer from '@/components/Containers/HeatmapSectorContainer'
import LeadsChartContainer from '@/components/Containers/LeadsChartContainer'
import LeadsRiskChartContainer from '@/components/Containers/LeadsRiskChartContainer'
import RoiChartContainer from '@/components/Containers/RoiChartContainer'
import SectorAccountContainer from '@/components/Containers/SectorAccountContainer'
import EventCalendar from '@/components/EventCalendar'
import { Card, CardContent } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import Image from 'next/image'

const countryCodeMap: Record<string, string> = {
  Spain: "ES", France: "FR", Italy: "IT", "United States": "US", Mexico: "MX", USA: "US",
};

const getFlagImageUrl = (country: string) => {
  const code = countryCodeMap[country];
  return code
    ? `https://flagcdn.com/w40/${code.toLowerCase()}.png`
    : "https://via.placeholder.com/40x30";
};


const MarketingDirectorHomePage = async() => {

  const totalContacts = await prisma.contact.count();

  const contactsByCountry = await prisma.contact.groupBy({
    by: ['countryId'],
    _count: { id: true },
  });

  const topCountry = contactsByCountry.reduce((max, current) =>
  current._count.id > max._count.id ? current : max, contactsByCountry[0]
);

  const countryIds = contactsByCountry.map((c) => c.countryId);

  const countries = await prisma.country.findMany({
  where: {
    id: { in: countryIds },
  },
  select: {
    id: true,
    name: true,
  },
});

const countryNameMap = Object.fromEntries(
  countries.map((c) => [c.id, c.name])
);


const totalCompanies = await prisma.company.count(); // Total de empresas

const accountsByCountry = await prisma.company.groupBy({
  by: ['countryId'],
  _count: {
    id: true,
  },
});

const topAccountCountry = accountsByCountry.reduce((max, current) =>
  current._count.id > max._count.id ? current : max, accountsByCountry[0]
);
const latestActivity = await prisma.activity.findFirst({
  orderBy: {
    date: 'desc',
  },
  select: {
    type: true,
    name: true,
    date: true,
    attendees: true,
    targetContacts: true,
  },
});

const latestLead = await prisma.lead.findFirst({
  orderBy: {
    createdAt: "desc",
  },
  select: {
    name: true,
    status: true,
    value: true,
    createdAt: true,
    accountManager: {
      select: { firstName: true, lastName: true },
    },
    country: {
      select: { name: true },
    },
    city: {
      select: { name: true },
    },
    company: {
      select: { name: true },
    },
  },
});

const totalActivities = await prisma.activity.count();

const totalLeads = await prisma.lead.count();

const pipeline = await prisma.lead.aggregate({
  _sum: {
    value: true,
  },
});
const pipelineTotal = pipeline._sum.value || 0; 

  // Cerrar conexión
  await prisma.$disconnect();
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row h-[650px]'>
    {/* LEFT */}
    <div className='w-full lg:w-2/3 flex flex-col gap-2'>
      {/* USER CARDS */}
     <div className='flex gap-4 justify-between flex-wrap'>
          {/* Card 1 */}
          <Card className="py-2 px-3 flex gap-4 w-[24%] flex-1 min-w-[220px] h-[180px] relative">
            <CardContent className="flex flex-col gap-3 p-0">
              <span className="text-sm text-gray-400 text-left">Contacts - Accounts</span>
              
              {/* Total de contactos */}
              <h1 className="text-sm text-gray-400 font-semibold text-left w-full">
                Total Contacts: {totalContacts}
              </h1>
              {/* Top country by contacts */}
              {topCountry && (
                <span className="inline-flex items-center text-sm text-gray-400 font-semibold">
                  <Image
                    src={getFlagImageUrl(countryNameMap[topCountry.countryId] || "Unknown")}
                    alt={countryNameMap[topCountry.countryId] || "Unknown"}
                    width={24}
                    height={16}
                    className="rounded-sm border border-gray-300"
                  />
                  <span className="ml-2">
                    {countryNameMap[topCountry.countryId] || "Unknown"} → {topCountry._count.id} contacts
                  </span>
                </span>
              )}
              {/* Total de empresas */}
              <h1 className="text-sm text-gray-400 font-semibold text-left w-full">
                Total Accounts: {totalCompanies}
              </h1>
              {/* Top country by accounts */}
              {topAccountCountry && (
                <span className="inline-flex items-center text-sm text-gray-400 font-semibold">
                  <Image
                    src={getFlagImageUrl(countryNameMap[topAccountCountry.countryId] || "Unknown")}
                    alt={countryNameMap[topAccountCountry.countryId] || "Unknown"}
                    width={24}
                    height={16}
                    className="rounded-sm border border-gray-300"
                  />
                  <span className="ml-2">
                    {countryNameMap[topAccountCountry.countryId] || "Unknown"} → {topAccountCountry._count.id} accounts
                  </span>
                </span>
              )}
              <div className="absolute right-4 ">
                <img src="/logo.png" alt="Account Manager" className="w-8 h-8 rounded-full border-2 border-white" />
              </div>
            </CardContent>
            
            <div className="absolute bottom-0 left-0 w-full h-[8px] flex rounded-xl overflow-hidden">
              <div className="w-[70%] h-full bg-[#6900EE]"></div>
              <div className="w-[30%] h-full bg-black"></div>
            </div>
          </Card>
          <Card className="py-2 px-3 flex gap-4 w-[24%] flex-1 min-w-[220px] h-[180px] relative">
            <CardContent className="flex flex-col gap-3 p-0">
              <span className="text-sm text-gray-400 text-left">Activities & Leads</span>

              <h1 className="text-sm text-gray-400 font-semibold text-left w-full">
                Total Activities: {totalActivities}
              </h1>

              <h1 className="text-sm text-gray-400 font-semibold text-left w-full">
                Total Leads: {totalLeads}
              </h1>

              <h1 className="text-sm text-gray-400 font-semibold text-left w-full">
                Pipeline: €{pipelineTotal.toLocaleString("es-ES", { maximumFractionDigits: 0 })}
              </h1>

              <div className="absolute right-4 ">
                <img src="/logo.png" alt="Account Manager" className="w-8 h-8 rounded-full border-2 border-white" />
              </div>
            </CardContent>

            <div className="absolute bottom-0 left-0 w-full h-[8px] flex rounded-xl overflow-hidden">
              <div className="w-[70%] h-full bg-[#6900EE]"></div>
              <div className="w-[30%] h-full bg-black"></div>
            </div>
          </Card>
          {/* Card 3 */}
          <Card className="py-2 px-3 flex gap-4 w-[24%] flex-1 min-w-[220px] h-[180px] relative">
          <CardContent className="flex flex-col gap-3 p-0">
            <span className="text-sm text-gray-400 text-left">Last Activity</span>

            <h1 className="text-sm text-gray-400 font-semibold text-left w-full">
              {latestActivity?.name || latestActivity?.type || "Unnamed"}
            </h1>

            <span className="text-sm text-gray-400 font-semibold">
              Date: {latestActivity?.date?.toLocaleDateString() ?? "Unknown"}
            </span>

            <span className="text-sm text-gray-400 font-semibold">
              Contacts: {latestActivity?.targetContacts ?? 0}
            </span>

            <span className="text-sm text-gray-400 font-semibold">
              Attendees: {latestActivity?.attendees ?? 0}
            </span>
            <div className="absolute right-4 ">
                <img src="/logo.png" alt="Account Manager" className="w-8 h-8 rounded-full border-2 border-white" />
              </div>
          </CardContent>

          <div className="absolute bottom-0 left-0 w-full h-[8px] flex rounded-xl overflow-hidden">
            <div className="w-[70%] h-full bg-[#6900EE]"></div>
            <div className="w-[30%] h-full bg-black"></div>
          </div>
        </Card>
        {/* Card 4 */}
        <Card className="py-2 px-3 flex gap-4 w-[24%] flex-1 min-w-[220px] h-[180px] relative">
          <CardContent className="flex flex-col gap-3 p-0">
            <span className="text-sm text-gray-400 text-left">Latest Lead</span>

            <h1 className="text-sm text-gray-400 font-semibold text-left w-full">
              {latestLead?.name || "Unnamed Lead"}
            </h1>

            <span className="text-sm text-gray-400 font-semibold">
              Value: {latestLead?.value?.toLocaleString("es-ES", {
                style: "currency",
                currency: "EUR",
              }) ?? "€0.00"}
            </span>

            <span className="text-sm text-gray-400 font-semibold">
              Created: {latestLead?.createdAt.toLocaleDateString("es-ES")}
            </span>

            <span className="text-sm text-gray-400 font-semibold">
              {latestLead?.accountManager?.firstName || "N/A"} {latestLead?.accountManager?.lastName || "N/A"}
            </span>
            

              <div className="absolute right-4 ">
                <img src="/logo.png" alt="Account Manager" className="w-8 h-8 rounded-full border-2 border-white" />
              </div>
          </CardContent>

          <div className="absolute bottom-0 left-0 w-full h-[8px] flex rounded-xl overflow-hidden">
            <div className="w-[70%] h-full bg-[#6900EE]"></div>
            <div className="w-[30%] h-full bg-black"></div>
          </div>
        </Card>
        </div>
     {/* MIDDLE CHARTS */}
     <div className='flex gap-4 flex-col lg:flex-row'>
          <div className='w-full lg:w-2/5 h-[450px]'>
            <ColdHotContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className='w-full lg:w-3/5 h-[450px]'>
             <FunnelRealContainer />
          </div>
        </div>       
     {/* BOTTOM CHART */}
     <div className='flex gap-4 flex-col lg:flex-row'>
          {/* HEATMAPS */}
          <div className='w-full lg:w-2/3 h-[450px] rounded-xl'>
            <HeatmapSectorContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className='w-full lg:w-2/3 h-[450px] rounded-xl'>
            {/* Pasando las propiedades al componente LeadsRiskChartContainer */}
             <LeadsRiskChartContainer />
          </div>
        </div>       
    </div>
    {/* RIGHT */}
    <div className='w-full lg:w-1/3 flex flex-col gap-8'>
        <EventCalendar />
        <SectorAccountContainer />
      </div>
 </div>
  )
}

export default MarketingDirectorHomePage