import Image from "next/image";
import prisma  from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ActivityTable from "@/components/Tables/ActivityTable";
import { ITEM_PER_PAGE } from "@/lib/settings";

const SingleActivityPage = async ({ params }: { params: { id: string } }) => {

const getCampaignDetails = async (id: string) => {
   return await prisma.activity.findUnique({
    where: { id },
    include: {
      area: {
        select: {
          id: true,
          name: true,
        },
      },
      cost: {
        select: {
          id: true,
          name: true,
          amount: true,
        },
      },
    },
  });
  };
  

 const campaign = await getCampaignDetails(params.id);
  
  if (!campaign) {
    return <p className="text-red-500">Activity not found</p>;
  }

const getLeadsCountByCampaign = async (activityId: string) => {
  const leadsCount = await prisma.lead.count({
    where: { activityId },
  });
    
  return leadsCount;
  };

  const leadsCount = await getLeadsCountByCampaign(params.id);
  const getTotalLeadValueByCampaign = async (activityId: string) => {
    const pipelineAmount = await prisma.lead.aggregate({
      _sum: {
        value: true, // Sumar el campo value
      },
      where: { activityId },
    });
  
    return pipelineAmount._sum.value || 0; // Si no hay leads, devuelve 0
  };  
  
  const pipelineAmount = await getTotalLeadValueByCampaign(params.id);

const [activities, totalCount] = await Promise.all([
  prisma.activity.findMany({
    include: {
      leads: {
        select: {
          id: true,
          name: true,
          value: true,
          accountManager: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          contact: {
            select: {
              firstName: true,
              lastName: true,
              jobTitle: true,
            },
          },
          company: {
            select: {
              id: true,
              name: true,
              revenue: true,
            },
          },
        },
      },
      cost: {
        select: {
          id: true,
          name: true,
          amount: true,
          currency: true,
        },
      },
      area: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    take: ITEM_PER_PAGE,
    orderBy: { date: "desc" },
  }),
  prisma.activity.count(),
]);

  

return (
<div className="flex flex-col gap-4 p-4 h-full">
  {/* TOP ROW: LEFT + RIGHT */}
  <div className="flex flex-col xl:flex-row gap-4">
    {/* LEFT */}
    <div className="flex-1">
      {/* TOP */}
      <div className="flex flex-col lg:flex-row gap-4 h-[270px]">
        {/* Organization Info Card */}
        <div className="relative rounded-md flex-1 flex gap-4 overflow-hidden">
          {/* Imagen de fondo y overlay */}
          <div className="absolute inset-0 h-full w-full">
            <div
              className="h-3/5 bg-cover bg-center relative"
              style={{ backgroundImage: "url('/background.jpg')" }}
            >
              <div className="absolute inset-0 bg-black opacity-10"></div>
            </div>
            <div className="h-2/5 bg-white flex flex-col items-center justify-center gap-4 p-6 rounded-lg shadow-lg">
              <h2 className="text-sm uppercase text-gray-500 tracking-wider">Activity Details</h2>
              <h1 className="text-2xl font-semibold text-gray-800">{campaign.type}</h1>
            </div>
          </div>
          <div className="relative flex w-full p-6">
            <div className="w-1/3 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="User Avatar"
                width={144}
                height={144}
                className="w-30 h-30 rounded-md object-cover border-4 border-white mr-16"
              />
            </div>
          </div>
        </div>
        {/* RIGHT CARD GROUP */}
        <div className="flex-1 flex gap-4 justify-between flex-wrap">
          {/* Card 1 */}
     <Card className="py-2 px-3 flex gap-4 w-[24%] flex-1 min-w-[220px] h-[180px] relative">
       <CardContent className="flex flex-col gap-3 p-0">
        <span className="text-sm text-gray-400 text-left">Activity Info</span>
        <h1 className="text-sm text-gray-400 font-semibold text-left w-full">{campaign.type}</h1>
        <h1 className="text-sm text-gray-400 font-semibold text-left w-full">
          Pipeline: {pipelineAmount} 
        </h1>
        <span className="text-sm text-gray-400 font-semibold">
          {campaign.area?.name}
        </span>
        <span className="text-sm text-gray-400 font-semibold">
         Cost: {campaign.cost?.amount} €
        </span>
        <div className="absolute right-4 bottom-6">
          <img src="/logo.png" alt="Account Manager" className="w-12 h-12 rounded-full border-2 border-white" />
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 w-full h-[8px] flex rounded-xl overflow-hidden">
        <div className="w-[70%] h-full bg-[#6900EE]"></div>
        <div className="w-[30%] h-full bg-black"></div>
      </div>
     </Card>
      {/* Card 2 */}
      <Card className="py-2 px-3 flex gap-4 w-[24%] flex-1 min-w-[220px] h-[180px] relative">
       <CardContent className="flex flex-col gap-3 p-0">
        <span className="text-sm text-gray-400 text-left">Results</span>
        <h1 className="text-sm text-gray-400 font-semibold text-left w-full">Leads: {leadsCount}</h1>
        <h1 className="text-sm text-gray-400 font-semibold text-left w-full">
          Pipeline: {pipelineAmount} €
        </h1>
        <span className="text-sm text-gray-400 font-semibold">
         Contacts: {campaign.targetContacts}
        </span>
        <span className="text-sm text-gray-400 font-semibold">
         Attendees: {campaign.attendees}
        </span>
        <div className="absolute right-4 bottom-6">
          <img src="/logo.png" alt="Account Manager" className="w-12 h-12 rounded-full border-2 border-white" />
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 w-full h-[8px] flex rounded-xl overflow-hidden">
        <div className="w-[70%] h-full bg-[#6900EE]"></div>
        <div className="w-[30%] h-full bg-black"></div>
      </div>
     </Card>
     {/* Card 3 */}
      <Card className="py-2 px-3 flex gap-4 w-[24%] flex-1 min-w-[220px] h-[70px] relative">
       <CardContent className="flex flex-col gap-3 p-0">
        <span className="text-sm text-gray-400 text-left">Additional Info</span>
        <h1 className="text-sm text-gray-400 font-semibold text-left w-full flex items-center space-x-2">
          <span>Released: {new Date(campaign.date).toLocaleDateString()}</span>
          <span></span>
          <span>Assistance:  %</span>
          <span></span>
          <span>Platform: {campaign.cost?.name}</span>
        </h1>
        <div className="absolute right-4 bottom-4">
          <img src="/logo.png" alt="Account Manager" className="w-12 h-12 rounded-full border-2 border-white " />
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 w-full h-[6px] flex rounded-xl overflow-hidden">
        <div className="w-[70%] h-full bg-[#6900EE]"></div>
        <div className="w-[30%] h-full bg-black"></div>
      </div>
     </Card>
        </div>
      </div>
    </div>

    {/* RIGHT */}
    <div className="w-full xl:w-[280px] min-h-[270px] flex flex-col gap-4">
      <Card className="flex-1 relative">
        <CardHeader>
          <CardTitle>New Activity</CardTitle>
          <CardDescription>Generate activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <Button asChild>
              <Link href="">New Request</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="">View My Requests</Link>
            </Button>
          </div>
          
        </CardContent>
        <div className="absolute right-4 bottom-4">
          <img
            src="/logo.png"
            alt="Account Manager"
            className="w-12 h-12 rounded-full border-2 border-white"
          />
        </div>
       <div className="absolute bottom-0 left-0 w-full h-[6px] flex rounded-xl overflow-hidden">
        <div className="w-[70%] h-full bg-[#6900EE]"></div>
        <div className="w-[30%] h-full bg-black"></div>
       </div>
      </Card>
      
    </div>
  </div>

  {/* BOTTOM */}
  <div className="mt-10 rounded-lg shadow">
      <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-300 flex items-center justify-between">
         <h2 className="text-lg font-semibold text-gray-700">Activities</h2> 
        <Link href="/list/campaign" className="text-md font-semibold text-gray-700 ml-2 hover:underline">
         View All
        </Link>
      </div>
      <div className="bg-white p-4 rounded-b-lg">
        <ActivityTable activities={activities} />



      </div>
    </div>
</div>
    

  )
}
export default SingleActivityPage;