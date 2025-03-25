import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { role } from '@/lib/data';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { Company, Contact } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type CompanyList = Company & { contacts: Contact[] };

const countryCodeMap: Record<string, string> = {
  Spain: "ES", France: "FR", Germany: "DE", Italy: "IT", 
  "United States": "US", "United Kingdom": "GB", Canada: "CA", 
  Mexico: "MX", Brazil: "BR", Argentina: "AR", Australia: "AU", 
  Japan: "JP", China: "CN", India: "IN", Netherlands: "NL", Sweden: "SE",
  USA: "US",
};

const getFlagImageUrl = (country: string) => {
  const code = countryCodeMap[country]; 
  return code
    ? `https://flagcdn.com/w40/${code.toLowerCase()}.png`
    : "https://via.placeholder.com/40x30"; 
};

const columns = [
  { header: "Company", accessor: "info" },
  { header: "Sector", accessor: "industry", className: "hidden md:table-cell" },
  { header: "Contact", accessor: "contact", className: "hidden md:table-cell" },
  { header: "Email", accessor: "email", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden md:table-cell" },
  { header: "Country", accessor: "country", className: "hidden md:table-cell" },
  { header: "City", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const renderRow = (item: CompanyList) => (
  <tr key={item.id} className="border-b border-gray-200 even:bg-gray-50 text-sm hover:bg-gray-100">
    <td className="flex items-center gap-4 p-4">
      <h3 className="font-semibold">{item.name}</h3>
    </td>
    <td className="hidden md:table-cell">{item.industry}</td>
    <td className="hidden md:table-cell">
      {item.contacts?.length > 0 ? (
        item.contacts.map((contact) => <p key={contact.id}>{contact.name}</p>)
      ) : (
        <p className="text-gray-400">No contacts</p>
      )}
    </td>
    <td className="hidden md:table-cell">
      {item.contacts?.length > 0 ? (
        item.contacts.map((contact) => <p key={contact.id}>{contact.email}</p>)
      ) : (
        <p className="text-gray-400">No email</p>
      )}
    </td>
    <td className="hidden md:table-cell">
      {item.contacts?.length > 0 ? (
        item.contacts.map((contact) => <p key={contact.id}>{contact.phone}</p>)
      ) : (
        <p className="text-gray-400">No phone</p>
      )}
    </td>
    <td className="hidden md:table-cell items-center gap-2">
      {item.country && (
        <Image
          src={getFlagImageUrl(item.country)}
          alt={item.country}
          width={24}
          height={16}
          className="rounded-sm border border-gray-300"
        />
      )}
      <span>{item.country || "N/A"}</span>
    </td>
    <td className="hidden md:table-cell">{item.city || "N/A"}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/organizations/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaBlue  text-white">
            <Image src="/view.png" alt="View" width={16} height={16} />
          </button>
        </Link>
        <FormModal table="company" type="update" id={item.id} />
        {role === "admin" && <FormModal table="company" type="delete" id={item.id} />}
      </div>
    </td>
  </tr>
);

const CompanyListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  const [data, count] = await prisma.$transaction([
    prisma.company.findMany({
      include: { contacts: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.company.count(),
  ]);

  return (
    <div className="bg-white p-6 rounded-md shadow-lg flex-1 m-4 mt-0 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="hidden md:block text-xl font-semibold text-gray-800">Organizations</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow ">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            <FormModal table="company" type="create" />
          </div>
        </div>
      </div>

      {/* Table */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default CompanyListPage;
