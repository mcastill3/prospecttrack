import prisma from "@/lib/prisma";
import Image from "next/image";

const UserCardDirectorMark = async ({ type }: { type: "leads" | "conversion" | "campaigns" | "contactos" }) => {
  let data: number | string = 0;

  if (type === "conversion") {
    const totalCampaigns = await prisma.campaign.count();
    const totalLeads = await prisma.lead.count({
      where: {
        campaignId: { not: null }
      }
    });
    const conversionRate = totalCampaigns > 0 ? (totalLeads / totalCampaigns) * 100 : 0;
    data = Math.round(conversionRate) + "%";
  } else {
    const modelMap = {
      leads: () => prisma.lead.count(),
      campaigns: () => prisma.campaign.count(), // Contar el número total de campañas
      contactos: () => prisma.contact.count(),
    } as const;

    data = await modelMap[type]();
  }

  return (
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaSky p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <Image src="/more.png" alt="" width={20} height={20} className="cursor-pointer" />
      </div>
      <h1 className="text-2xl font-semibold my-4 text-white">{data}</h1>
      <h2 className="capitalize text-sm font-medium text-white">{type}</h2>
    </div>
  );
};

export default UserCardDirectorMark;