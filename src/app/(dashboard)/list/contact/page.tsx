import ContactFilter from "@/components/Filters/ContactFilter";
import ContactFormCreate from "@/components/forms/Modal/ContactFormCreate";

import Pagination from "@/components/Pagination";
import ContactTable from "@/components/Tables/ContactTable";

import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";

const ContactListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const page = parseInt(searchParams.page || "1", 10);
  const startIndex = (page - 1) * ITEM_PER_PAGE;

  const lastNameFilter = searchParams.lastName?.trim();
  const emailFilter = searchParams.email?.trim();
  const jobTitleFilter = searchParams.jobTitle?.trim();
  const countryIdFilter = searchParams.countryId?.trim();
  const cityIdFilter = searchParams.cityId?.trim();

  // 👇 Agregamos la consulta de companies
  const [countries, cities, companies, contacts, totalCount, prospectCount, clientCount, partnerCount] =
    await Promise.all([
      prisma.country.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.city.findMany({
        select: { id: true, name: true, countryId: true },
        orderBy: { name: "asc" },
      }),
      prisma.company.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      }),
      prisma.contact.findMany({
        where: {
          type: { in: ["PROSPECT", "CLIENT"] },
          ...(lastNameFilter && {
            lastName: {
              contains: lastNameFilter,
              mode: "insensitive",
            },
          }),
          ...(emailFilter && {
            email: {
              contains: emailFilter,
              mode: "insensitive",
            },
          }),
          ...(jobTitleFilter && { jobTitle: jobTitleFilter as any }),
          ...(countryIdFilter && { countryId: countryIdFilter }),
          ...(cityIdFilter && { cityId: cityIdFilter }),
        },
        include: {
          company: { select: { name: true } },
          country: { select: { name: true } },
          city: { select: { name: true } },
        },
        skip: startIndex,
        take: ITEM_PER_PAGE,
      }),
      prisma.contact.count({
        where: {
          type: { in: ["PROSPECT", "CLIENT", "PARTNER"] },
          ...(lastNameFilter && {
            lastName: {
              contains: lastNameFilter,
              mode: "insensitive",
            },
          }),
          ...(emailFilter && {
            email: {
              contains: emailFilter,
              mode: "insensitive",
            },
          }),
          ...(jobTitleFilter && { jobTitle: jobTitleFilter as any }),
          ...(countryIdFilter && { countryId: countryIdFilter }),
          ...(cityIdFilter && { cityId: cityIdFilter }),
        },
      }),
      prisma.contact.count({ where: { type: "PROSPECT" } }),
      prisma.contact.count({ where: { type: "CLIENT" } }),
      prisma.contact.count({ where: { type: "PARTNER" } }),
    ]);

  return (
    <div className="mt-10 rounded-lg shadow">
      <ContactFilter countries={countries} cities={cities} totalCount={totalCount} />

      <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-300 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">
          Contacts - Prospects: {prospectCount} | Clients: {clientCount} | Partners: {partnerCount}
        </h2>

        {/* 👇 Aquí colocamos el botón + modal */}
        <ContactFormCreate countries={countries} cities={cities} companies={companies} />
      </div>

      <div className="bg-white p-4 rounded-b-lg">
        <ContactTable contacts={contacts} />
        <Pagination page={page} count={totalCount} />
      </div>
    </div>
  );
};

export default ContactListPage;