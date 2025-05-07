import PerformanceChartContainer from '@/components/Containers/PerformanceChartContainer';
import TablePlayerCampaigns from '@/components/Tables/TablePlayerCampaigns';
import TablePlayerLeads from '@/components/Tables/TablePlayerLeads';
import TablePlayerLeadsTracking from '@/components/Tables/TablePlayerLeadsTracking';
import TableRankingPlayers from '@/components/Tables/TableRankingPlayers';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const SinglePlayerPage = async ({ params: { id } }: { params: { id: string } }) => {
   // Obtener el jugador
   const player = await prisma.player.findUnique({
      where: { id },
   });

   if (!player) {
      return notFound();
   }

   // Obtener oportunidades generadas (Leads asociados al player)
   const totalLeads = await prisma.lead.count({
      where: {
         players: {
            some: { id },
         },
      },
   });

   // Obtener leads convertidos en clientes (status: CLOSED_WON)
   const convertedLeads = await prisma.lead.count({
      where: {
         players: {
            some: { id },
         },
         status: "CLOSED", // Ajusta según el enum LeadStatus de tu DB
      },
   });

   // Calcular tasa de conversión
   const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : "0";

   const activeCampaigns = await prisma.campaign.count({
      where: {
         players: {
            some: { id }, // Relación many-to-many con jugadores
         },
         status: { in: ["TO_DO", "IN_PROGRESS"] }, // Filtrar campañas activas
      },
   });

   // Calcular el monto total de pipeline generado por el jugador (suma de los montos de leads)
const totalPipeline = await prisma.lead.aggregate({
   where: {
      players: {
         some: { id }, // Relación many-to-many con jugadores
      },
   },
   _sum: {
      value: true, // Suponiendo que la columna del monto en leads se llama "amount"
   },
});

// Si no hay leads, el valor por defecto será 0
const pipelineAmount = totalPipeline._sum.value || 0;


   return (
      <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
         {/*LEFT*/}
         <div>
            {/*TOP*/}
            <div className="flex flex-col lg:flex-row gap-4 h-[250px] w-[1200px]">
               {/*USER INFO CARD*/}
               <div className="relative rounded-md flex-1 flex gap-4 overflow-hidden">
                  {/* Fondo dividido: Imagen con overlay arriba, blanco abajo */}
                  <div className="absolute inset-0 h-full w-full">
                     <div className="h-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('/background.jpg')" }}>
                        {/* Overlay oscuro para mejorar legibilidad */}
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                     </div>
                       {/* Información del usuario */}
                     <div className="h-1/2 bg-white flex flex-col items-center justify-center gap-2 ">
                        {/* Nombre */}
                        <h1 className="text-xl font-semibold text-black">{player.name + " " + player.surname}</h1>

                        {/* Información adicional en dos columnas */}
                        <div className="grid grid-cols-2 gap-x-0 gap-y-2 text-black text-sm self-end mr-8">
                           {/* Departamento */}
                           <div className="flex items-center gap-2">
                              <Image src="/department.png" alt="Department Icon" width={20} height={20} />
                              <span>{player.department}</span>
                           </div>
                           {/* Rol */}
                           <div className="flex items-center gap-2">
                              <Image src="/roleEmployee.png" alt="Role Icon" width={20} height={20} />
                              <span>{player.role.replace(/_/g, " ")}</span>
                           </div>
                           
                            {/* Phone */}
                            <div className="flex items-center gap-2">
                              <Image src="/mobilephone.png" alt="Phone Icon" width={20} height={20} />
                            <span>{player.phone || "-"}</span>
                           </div>  
                            {/* Email */}
                            <div className="flex items-center gap-2">
                                 <Image src="/email.png" alt="Email Icon" width={20} height={20} />
                                 <span className="break-words whitespace-normal max-w-[110px]">
                                    {player.email.replace("@", "@\u200B")}
                                 </span>
                            </div>                        
                        </div>
                     </div>

                  </div>
                  {/* Contenido de la tarjeta */}
                  <div className="relative flex w-full p-6 gap-4">
                     {/* Imagen de usuario */}
                     <div className="w-1/3 flex items-center justify-center">
                        <Image
                           src={player.img || "/noAvatar.png"}
                           alt="User Avatar"
                           width={144}
                           height={144}
                           className="w-36 h-36 rounded-full object-cover border-4 border-white mr-16"
                        />
                     </div>
                  </div>
               </div>

               {/* SMALL CARDS */}
               <div className="flex-1 flex gap-4 justify-between flex-wrap">
                  {/* Oportunidades generadas */}
                  <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                     <Image src="/prospect.png" alt="Prospects" width={24} height={24} className="w-6 h-6" />
                     <div>
                        <h1 className="text-xl font-semibold">{totalLeads}</h1>
                        <span className="text-sm text-gray-400">Prospects</span>
                     </div>
                  </div>

                  {/* Tasa de conversión */}
                  <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                     <Image src="/funnel.png" alt="Conversion Rate" width={24} height={24} className="w-6 h-6" />
                     <div>
                        <h1 className="text-xl font-semibold">{conversionRate}%</h1>
                        <span className="text-sm text-gray-400">Conversion Rate</span>
                     </div>
                  </div>

                  {/* Campañas activas */}
                  <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                     <Image src="/campaigns.png" alt="Campaigns" width={24} height={24} className="w-6 h-6" />
                     <div>
                        <h1 className="text-xl font-semibold">{activeCampaigns}</h1>
                        <span className="text-sm text-gray-400">Active Campaigns</span>
                     </div>
                  </div>


                  {/* Pipeline generado */}
                  <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                     <Image src="/lastActivity.png" alt="Pipeline" width={24} height={24} className="w-6 h-6" />
                     <div>
                     <h1 className="text-xl font-semibold">
                        {pipelineAmount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                     </h1>
                        <span className="text-sm text-gray-400">Pipeline Generated</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* BOTTOM */}
            <div className="mt-4 bg-white rounded-md p-4 h-[920px]">
               <div className="mb-6">
                  <TablePlayerCampaigns playerId={id} />
               </div>
               <div>
                  <TablePlayerLeads playerId={id} />
               </div>
            </div>            
         </div>

         {/* RIGHT */}
         <div className="w-full xl:w-1/3 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-md h-[350px]">
               <PerformanceChartContainer playerId={id}/>
            </div>
            <div className="bg-white p-4 rounded-md h-[450px]">
               <TableRankingPlayers playerId={id} />
            </div>
            <div className="bg-white p-4 rounded-md h-[320px]">
               <TablePlayerLeadsTracking playerId={id} />
            </div>
         </div>
      </div>
   );
};

export default SinglePlayerPage;