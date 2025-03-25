import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination'
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch'
import { role} from '@/lib/data';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { Contact, Partner } from '@prisma/client';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'



type PartnerList = Partner & {contacts:Contact[]} 

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
  {
    header: "Partner",
    accessor: "info",
  },
  {
    header: "Sector",
    accessor: "industry",
    className: "hidden md:table-cell",
  },
  {
    header: "Contact",
    accessor: "contact",
    className: "hidden md:table-cell",
  },
  {
    header: "Email",
    accessor: "email",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden md:table-cell",
  },
  {
    header: "Country",
    accessor: "country",
    className: "hidden md:table-cell",
  },
  {
    header: "City",
    accessor: "address",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const renderRow = (item: PartnerList) => (
  <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurple1Light">
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.industry}</td>
    <td className="hidden md:table-cell">
      {item.contacts?.map((contact) => (
        <div key={contact.id}>
          <p>{contact.name}</p>
        </div>
      )) || <p>No contacts available</p>}
    </td>
    <td className="hidden md:table-cell">
      {item.contacts?.map((contact) => (
        <div key={contact.id}>
          <p>{contact.email}</p>
        </div>
      )) || <p>No contacts available</p>}
    </td>
    <td className="hidden md:table-cell">
      {item.contacts?.map((contact) => (
        <div key={contact.id}>
          <p>{contact.phone}</p>
        </div>
      )) || <p>No contacts available</p>}
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
    <td className="hidden md:table-cell">{item.city}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/partner/${item.id}`}>
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaBlue">
            <Image src="/view.png" alt="" width={16} height={16} />
          </button>
        </Link>
        <FormModal table="partner" type="update" id={item.id} />
        {role === "admin" && <FormModal table="partner" type="delete" id={item.id} />}
      </div>
    </td>
  </tr>
);

const PartnerListPage = async({
  searchParams,
}: {
  searchParams: { [key: string]: string  | undefined };
}) => {
  
  const {page, ...queryParams} = searchParams;
  
  const p = page ? parseInt(page) : 1;

  const [data,count] = await prisma.$transaction([
    prisma.partner.findMany({
      include: {
        contacts: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.partner.count()
  ]);

  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0 h-full'>
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Partners</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            <FormModal table="partner" type="create"/>
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data}/>
      <Pagination page={p} count={count} />
    </div>
  );
}

export default PartnerListPage;