import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import prisma  from "@/lib/prisma";
import LeadListPage from '../../lead/page'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ITEM_PER_PAGE } from '@/lib/settings'

const countryCodeMap: Record<string, string> = {
  Spain: "ES", France: "FR", Italy: "IT", "United States": "US", Mexico: "MX", USA: "US",
};

const getFlagImageUrl = (country: string) => {
  const code = countryCodeMap[country];
  return code
    ? `https://flagcdn.com/w40/${code.toLowerCase()}.png`
    : "https://via.placeholder.com/40x30";
};

const SingleContactPage = async ({ params }: { params: { id: string } }) => {

  function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    currencyDisplay: 'symbol'
  }).format(amount);
}

  const id = params.id; // o como recibas el ID (por query, ruta, etc.)

 

const contacts = await prisma.contact.findUnique({
  where: { id },
  include: {
    activityContacts: {
      include: {
        activity: {
          include: {
            leads: {
              select: {
                name: true,
              },
            },
            cost: true,
          },
        },
      },
    },
    leads: {
      include: {
        accountManager: true,
      },
    },
    country: true,
    city: true,
    company: true,
  },
});




const numberOfActivities = contacts?.activityContacts?.filter(ac => ac.activity != null).length || 0;
const numberOfLeads = contacts?.leads?.length || 0;
// Contar los leads asociados a la compañía
const leadCount = await prisma.lead.count({
  where: { companyId: id },
});

// Contar las actividades asociadas a la compañía
const activityCount = await prisma.activity.count({
  where: {
    activityContacts: {
      some: {
        contact: {
          companyId: id,
        },
      },
    },
  },
});

const activities = await prisma.activity.findMany({
  where: {/* filtro si necesitas */},
  include: {
    cost: true,  // así traes el objeto cost con amount, currency, etc.
  },
});

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
      {/* Fondo dividido: Imagen con overlay arriba, blanco abajo */}
      <div className="absolute inset-0 h-full w-full">
        <div className="h-2/5 bg-cover bg-center relative" style={{ backgroundImage: "url('/background.jpg')" }}>
              {/* Overlay oscuro para mejorar legibilidad */}
              <div className="absolute inset-0 bg-black opacity-10"></div>
        </div>
             <div className="h-2/5 bg-white flex flex-col items-end justify-center gap-4 p-6 shadow-md border border-gray-200">
              <h2 className="text-sm uppercase text-gray-500 tracking-wider">Contact Details</h2>
              <h1 className="text-2xl font-semibold text-gray-800">{contacts?.firstName} {contacts?.lastName}</h1>
            </div> 
            {/* Información de la Organización */}
          <div className="h-2/3 bg-white flex flex-col items-center justify-center gap-2 ">                              
              {/* Línea separadora */}
              <div className="w-full border-b border-gray-300 mt-20"></div>
               {/* Opciones de enlaces */}                

              </div>
             
          </div>
      {/* Contenido de la tarjeta */}
      <div className="relative flex w-full p-6 ">
          {/* Imagen de usuario */}
            <div className="relative flex w-full p-6">
                    <div className="w-1/3 flex items-center justify-center">
                      <Image
                        src="/logo.png"
                        alt="User Avatar"
                        width={120}
                        height={120}
                        className="w-30 h-30 rounded-md object-cover border-4 border-white mr-16"
                      />
                    </div>
                  </div>                                          
            </div>                                
        </div>
        {/* RIGHT CARD GROUP */}
        <div className="flex-1 flex gap-4 justify-between flex-wrap">
          {/* Card 1 */}
    <Card className="py-2 px-3 flex gap-4 w-[24%] flex-1 min-w-[220px] h-[180px] relative">
      <CardContent className="flex flex-col gap-3 p-0">
        <span className="text-sm text-gray-400 text-left">Contact Info</span>
        <h1 className="text-sm text-gray-400 font-semibold text-left w-full">
          Job Title: {contacts?.jobTitle} 
        </h1>
        <span className="text-sm text-gray-400 font-semibold">
         Email: {contacts?.email}
        </span>
        <span className="text-sm text-gray-400 font-semibold">
         Phone: {contacts?.phone1 || "Unknown"}
        </span>
        <span className="inline-flex items-center text-sm text-gray-400 font-semibold">
          <Image
            src={getFlagImageUrl(contacts?.country.name || "UN")}
            alt={contacts?.country.name || "Unknown"}
            width={24}
            height={16}
            className="rounded-sm border border-gray-300"
          />
          <span className="ml-2">{contacts?.country.name || "UN"} - {contacts?.city.name || "UN"}</span> 
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
        <span className="text-sm text-gray-400 text-left">Account Info</span>
        <h1 className="text-sm text-gray-400 font-semibold text-left w-full">
          Account: {contacts?.company?.name} 
        </h1>
        <span className="text-sm text-gray-400 font-semibold">
          Sector: {contacts?.company?.sector?.replace(/_/g, ' ')}
        </span>
        <span className="text-sm text-gray-400 font-semibold">
          {contacts?.company?.revenue != null
            ? contacts?.company.revenue >= 500000000
              ? 'Enterprise'
              : 'SMB'
            : 'Revenue not available'}
        </span>
          <span className="text-sm text-gray-400 font-semibold">
          Employees: {contacts?.company?.size}
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
               <span>Activities: {numberOfActivities}</span>
               <span></span>
               <span>Leads: {numberOfLeads} </span>
               <span></span>
               <span>Opportunities: - </span>
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
        <h2 className="text-lg font-semibold text-gray-700">Activities Involved</h2>         
      </div>
      <div className="bg-white p-4 rounded-b-lg">
        <Table className="min-w-full border-collapse">
        <TableHeader className="bg-gray-900 text-white font-semibold">
          <TableRow className="hover:bg-gray-100">
            <TableHead className="py-4 px-6 text-left text-white">Name</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Type</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Date</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Invited</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Attendees</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Follow Up</TableHead>            
            <TableHead className="py-4 px-6 text-left text-white">Cost</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {contacts?.activityContacts && contacts.activityContacts.length > 0 ? (
            contacts.activityContacts.map(({ activity }) => (
              <TableRow key={activity.id} className="hover:bg-gray-100">
                <TableCell className="py-4 px-6 text-left text-xs">
                  {activity.name || "No Activity"}
                </TableCell>
                <TableCell className="py-4 px-6 text-left text-xs">{activity.type}</TableCell>
                <TableCell className="py-4 px-6 text-left text-xs">
                  {new Date(activity.date).toLocaleDateString()}
                </TableCell>
                <TableCell className="py-4 px-6 text-left text-xs capitalize">
                  {activity.targetContacts}
                </TableCell>
                <TableCell className="py-4 px-6 text-left text-xs">
                  {activity.attendees}
                </TableCell>
               
                <TableCell className="py-4 px-6 text-left text-xs">
                  {activity.cost ? formatCurrency(activity.cost.amount) : "N/A"}
                </TableCell>
                <TableCell className="flex items-center gap-2 px-6 py-4">
                  <Link href={`/list/campaign/${activity.id}`}>
                    <Button className="bg-[#D1D5DB] rounded-full p-0 h-8 w-8 flex items-center justify-center">
                      <Image src="/view.png" alt="View" width={18} height={18} />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-500 py-4">
                No activities associated
              </TableCell>
            </TableRow>
          )}
        </TableBody>

      </Table>
      </div>
    </div>
</div>

  )
}

export default SingleContactPage