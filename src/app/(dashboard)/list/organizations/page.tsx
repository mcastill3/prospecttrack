import CompanyFilter from "@/components/Filters/CompanyFilter";
import CompanyFormCreate from "@/components/forms/Modal/CompanyFormCreate";
import Pagination from "@/components/Pagination";
import OrganizationTable from "@/components/Tables/OrganizationTable";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { ExtendedCompany } from "@/types/company";



const OrganizationListPage = async ({ 
  searchParams 
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const page = parseInt(searchParams.page || "1", 10);
  const startIndex = (page - 1) * ITEM_PER_PAGE;

  // 📌 Filtros desde la URL
  const nameFilter = searchParams.name || "";
  const sectorFilter = searchParams.sector || "";
  const typeFilter = searchParams.type || "";
  const hasLeadsFilter = searchParams.hasLeads === "true";
  const countryIdFilter = searchParams.countryId || "";
  const cityIdFilter = searchParams.cityId || "";

  const leadsCondition = hasLeadsFilter
  ? { leads: { some: {} } } // Filtra solo las empresas con al menos un 'lead'
  : {};

  const typeCondition =
  typeFilter === "Enterprise"
    ? { revenue: { gte: 500_000_000 } }
    : typeFilter === "SMB"
    ? { revenue: { lt: 500_000_000 } }
    : {};

  // 🔍 Fetch con filtro por nombre aplicado
  const [companies, totalCount, enterpriseCount, smbCount] = await Promise.all([
    prisma.company.findMany({
      where: {
        ...(nameFilter && {
          name: {
            contains: nameFilter,
            mode: "insensitive",
          },
        }),
        ...(sectorFilter && { sector: sectorFilter as any }),
        ...typeCondition,
        ...leadsCondition,
        ...(countryIdFilter && { countryId: countryIdFilter }),
        ...(cityIdFilter && { cityId: cityIdFilter }),
      },
      include: {
        country: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        leads: {
          select: {
            id: true,
            name: true,
            accountManager: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        contacts: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            jobTitle: true,
            type: true,
          },
        },
      },
      skip: startIndex,
      take: ITEM_PER_PAGE,
    }),

    prisma.company.count({
      where: {
        ...(nameFilter && {
          name: {
            contains: nameFilter,
            mode: "insensitive",
          },
        }),
        ...(sectorFilter && { sector: sectorFilter as any }),
        ...typeCondition,
        ...leadsCondition,
        ...(countryIdFilter && { countryId: countryIdFilter }),
        ...(cityIdFilter && { cityId: cityIdFilter }),
      },
    }),

    prisma.company.count({
      where: {
        revenue: { gt: 250_000_000 },
        ...(nameFilter && {
          name: {
            contains: nameFilter,
            mode: "insensitive",
          },
        }),
        ...(sectorFilter && { sector: sectorFilter as any }),
        ...typeCondition,
        ...leadsCondition,
        ...(countryIdFilter && { countryId: countryIdFilter }),
        ...(cityIdFilter && { cityId: cityIdFilter }),
      },
    }),

    prisma.company.count({
      where: {
        revenue: { lte: 250_000_000 },
        ...(nameFilter && {
          name: {
            contains: nameFilter,
            mode: "insensitive",
          },
        }),
        ...(sectorFilter && { sector: sectorFilter as any }),
        ...typeCondition,
        ...leadsCondition,
        ...(countryIdFilter && { countryId: countryIdFilter }),
        ...(cityIdFilter && { cityId: cityIdFilter }),
      },
    }),
  ]);

  const [countries, cities] = await Promise.all([
  prisma.country.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  }),
  prisma.city.findMany({
    select: { id: true, name: true, countryId: true },
    orderBy: { name: "asc" },
  }),
]);
  // 👥 Clasificación
  const companiesWithLeadCount: ExtendedCompany[] = await Promise.all(
    companies.map(async (company) => {
      const leadCount = await prisma.lead.count({
        where: {
          companyId: company.id,
        },
      });

      const isEnterprise =
        typeof company.revenue === "number" && company.revenue >= 500_000_000;

      return {
        ...company,
        leadCount,
        classification: isEnterprise ? "Enterprise" : "SMB",
      } as ExtendedCompany;
    })
  );

  return (
    <div className="mt-10 rounded-lg shadow">
      <CompanyFilter 
        countries={countries} 
        cities={cities}
        totalCount={totalCount} 
      />
      <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-300 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">Accounts -  Enterprise: {enterpriseCount} | SMB: {smbCount}</h2>
          <CompanyFormCreate countries={countries} cities={cities} />
      </div>
      <div className="bg-white p-4 rounded-b-lg">
        <OrganizationTable companies={companiesWithLeadCount} />
        <Pagination page={page} count={totalCount} />
      </div>
    </div>
  );
};

export default OrganizationListPage;