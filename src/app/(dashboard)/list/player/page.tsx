import FormContainer from '@/components/FormContainer';
import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import { role } from '@/lib/data';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { City, Country, Player, Prisma } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const countryCodeMap: Record<string, string> = {
  Spain: "ES", France: "FR", Germany: "DE", Italy: "IT", 
  "United States": "US", "United Kingdom": "GB", Canada: "CA", 
  Mexico: "MX", Brazil: "BR", Argentina: "AR", Australia: "AU", 
  Japan: "JP", China: "CN", India: "IN", Netherlands: "NL", Sweden: "SE",
  USA: "US",
};

// Función para obtener la URL de la bandera
const getFlagImageUrl = (country: string) => {
  const code = countryCodeMap[country]; 
  return code
    ? `https://flagcdn.com/w40/${code.toLowerCase()}.png`
    : "https://via.placeholder.com/40x30"; 
};

type PlayerList = Player & { country: Country } & { city: City };

const columns = [
  { header: 'Info', accessor: 'info' },
  { header: 'Username', accessor: 'memberId', className: 'hidden md:table-cell' },
  { header: 'Phone', accessor: 'phone', className: 'hidden lg:table-cell' },
  { header: 'Department', accessor: 'department', className: 'hidden md:table-cell' },
  { header: 'Role', accessor: 'role', className: 'hidden md:table-cell' },
  { header: 'Country', accessor: 'country', className: 'hidden md:table-cell' },
  { header: 'City', accessor: 'address', className: 'hidden lg:table-cell' },
  { header: 'Actions', accessor: 'action' },
];

const renderRow = (item: PlayerList) => (
  <tr key={item.id} className="border-b border-gray-200 even:bg-gray-100 text-sm hover:bg-lamaPurple1Light">
    <td className="flex items-center gap-4 p-4">
      <Image
        src={item.img || '/noAvatar.png'}
        alt="User Avatar"
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover shadow-md"
      />
      <div className="flex flex-col">
        <h3 className="font-semibold text-gray-800">{item.name} {item.surname}</h3>
        <p className="text-xs text-gray-500">{item?.email}</p>
      </div>
    </td>
    <td className="hidden md:table-cell text-gray-700">{item.username}</td>
    <td className="hidden md:table-cell text-gray-700">{item.phone}</td>
    <td className="hidden md:table-cell text-gray-700">{item.department}</td>
    <td className="hidden md:table-cell text-gray-700">{item.role.replace(/_/g, " ")}</td>
    <td className="hidden md:table-cell text-gray-700 items-center gap-2">
      {item.country?.name && (
        <div className="flex items-center space-x-2">
        <Image
          src={getFlagImageUrl(item.country.name)}
          alt={item.country.name}
          width={24}
          height={16}
          className="rounded-sm border border-gray-300"
        />
        <span>{item.country.name}</span>
      </div>
      )}
    </td>
    <td className="hidden md:table-cell text-gray-700">{item.city?.name}</td>
    <td>
      <div className="flex items-center gap-2">
        <Link href={`/list/team/${item.id}`}>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaBlue text-white shadow-md">
            <Image src="/view.png" alt="View" width={16} height={16} />
          </button>
        </Link>
        {role === "admin" && (
        <FormContainer table="player" type="update" id={item.id} />
      )}
        {role === "admin" && (
         <FormContainer table="player" type="delete" id={item.id} />
        )}
      </div>
    </td>
  </tr>
);

const PlayerListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;
  
  const query: Prisma.PlayerWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case 'department':
            query.department = { equals: value, mode: 'insensitive' };
            break;
          case 'search':
            query.name = { contains: value, mode: 'insensitive' };
            break;
          default:
            break;
        }
      }
    }
  }

  const [data, count] = await prisma.$transaction([
    prisma.player.findMany({
      where: query,
      include: { country: true, city: true },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.player.count({ where: query }),
  ]);

  return (
    <div className='bg-white p-6 rounded-lg shadow-md flex-1 m-4 mt-0 h-full border border-gray-300'>
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <h1 className="text-xl font-semibold text-gray-800">Team</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-lamaYellow hover:bg-gray-800 text-white shadow-md">
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-lamaYellow hover:bg-gray-800 text-white shadow-md">
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {(role === "admin" || role === "director_marketing") && <FormContainer table="player" type="create" />}
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={data} />
      <Pagination page={p} count={count} />
    </div>
  );
};

export default PlayerListPage;
