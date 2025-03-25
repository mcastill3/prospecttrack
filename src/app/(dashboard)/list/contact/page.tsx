import FormModal from '@/components/FormModal';
import Pagination from '@/components/Pagination'
import Table from '@/components/Table';
import TableSearchContact from '@/components/TableSearchContact';
import { role} from '@/lib/data';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { Company, Contact, Partner } from '@prisma/client';
import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

type ContactList = Contact & {company:Company}  & {partner:Partner}

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
    header: "Info",
    accessor: "info",
  },
  {
    header: "Organization",
    accessor: "company",
    className: "hidden md:table-cell",
  },
  {
    header: "Role",
    accessor: "role",
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
    className: "hidden lg:table-cell",
  },
  {
    header: "City",
    accessor: "city",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const renderRow = (item: ContactList) => (
  <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurple1Light">
    <td className="flex items-center gap-4 p-4">
      <div className="flex flex-col">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-xs text-gray-500">{item.email}</p>
      </div>
    </td>
    <td className="hidden md:table-cell">{item.company?.name}</td>
    <td className="hidden md:table-cell">{item.role}</td>
    <td className="hidden md:table-cell">{item.phone}</td>
     <td className="hidden md:table-cell items-center gap-2">
          
     {item.company.country && (
  <div className="flex items-center space-x-2">
    <Image
      src={getFlagImageUrl(item.company.country)}
      alt={item.company.country}
      width={24}
      height={16}
      className="rounded-sm border border-gray-300"
    />
    <span>{item.company.country}</span>
  </div>
)}

{!item.company.country && <span>N/A</span>}
        </td>
    <td className="hidden md:table-cell">{item.company?.city}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/contact/${item.id}`} >
          <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaBlue">
            <Image src="/view.png" alt="" width={16} height={16} />
          </button>
        </Link>
        <FormModal table="contact" type="update" id={item.id} />
        {role === "admin" && <FormModal table="contact" type="delete" id={item.id} />}
      </div>
    </td>
  </tr>
);

const ContactListPage = async({
  searchParams,
}: {
  searchParams: { [key: string]: string  | undefined };
}) => {
  
  const {page, ...queryParams} = searchParams;
  
  const p = page ? parseInt(page) : 1;

  const [data, count] = await prisma.$transaction([
    prisma.contact.findMany({
      where: {
        type: {
          equals: "Client",
          mode: "insensitive",
        },
      },
      include: {
        company: {
          select: {
            name: true,
            country: true,
            city: true,
          },
        },
        partner: {
          select: {
            name: true,
            country: true,
            city: true,
          },
        },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.contact.count({
      where: {
        type: "Client",
      },
    }),
  ]);
  
  return (
    <div className='bg-white p-4 rounded-md flex-1 m-4 mt-0 h-full'>
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Contactos</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
           <TableSearchContact />
           <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              <FormModal table="contact" type="create"/>
           </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data}/>
      <Pagination page={p} count={count} />
    </div>
  )
}

export default ContactListPage