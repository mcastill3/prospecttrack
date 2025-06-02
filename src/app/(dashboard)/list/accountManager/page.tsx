import Pagination from '@/components/Pagination'
import { ITEM_PER_PAGE } from '@/lib/settings';
import React from 'react'
import prisma from "@/lib/prisma";
import AccountManagerTable from '@/components/Tables/AccountManagerTable';
import AccountManagerFormCreate from '@/components/forms/Modal/AccountManagerFormCreate';


const AccountManagerList = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {

    const page = parseInt(searchParams.page || "1", 10);
    const startIndex = (page - 1) * ITEM_PER_PAGE;

    const [accountManagers, totalCount] = await Promise.all([
    prisma.accountManager.findMany({
      skip: startIndex,
      take: ITEM_PER_PAGE,
      include: {
        area: true,
        country: true,
        city: true,
      },
    }),
    prisma.accountManager.count(),
  ]);

  return (
    <div className="mt-10 rounded-lg shadow">
      

      <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-300 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">
          Account Managers
        </h2>

        {/* 👇 Aquí colocamos el botón + modal */}
       <AccountManagerFormCreate /> 
      </div>

      <div className="bg-white p-4 rounded-b-lg">
        <AccountManagerTable managers={accountManagers} />
        <Pagination page={page} count={totalCount} />
      </div>
    </div>
  )
}

export default AccountManagerList