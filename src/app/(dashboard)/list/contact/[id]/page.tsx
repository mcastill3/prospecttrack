import PerformanceChartContainer from '@/components/Containers/PerformanceChartContainer';
import TableContactCampaigns from '@/components/Tables/TableContactCampaigns';
import TableContactLeads from '@/components/Tables/TableContactLeads';
import TablePlayerLeadsTracking from '@/components/Tables/TablePlayerLeadsTracking';
import TableRankingPlayers from '@/components/Tables/TableRankingPlayers';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { notFound } from 'next/navigation';


const countryCodeMap: Record<string, string> = {
    Spain: "ES", France: "FR", Germany: "DE", Italy: "IT", 
    "United States": "US", "United Kingdom": "GB", Canada: "CA", 
    Mexico: "MX", Brazil: "BR", Argentina: "AR", Australia: "AU", 
    Japan: "JP", China: "CN", India: "IN", Netherlands: "NL", Sweden: "SE",
    USA: "US",
  };
  
  // Función para obtener la URL de la bandera basada en el país del contacto
  const getFlagImageUrl = (contact: { country?: string }) => {
    const code = contact.country ? countryCodeMap[contact.country] : null; 
    return code
      ? `https://flagcdn.com/w40/${code.toLowerCase()}.png`
      : "https://via.placeholder.com/40x30"; 
  };
  
  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-500"; // 🟢 Abierto
      case "CONTACTED":
        return "bg-blue-500"; // 🔵 Contactado
      case "QUALIFIED":
        return "bg-yellow-500"; // 🟡 Calificado
      case "CLOSED":
        return "bg-gray-500"; // ⚪ Cerrado
      case "LOST":
        return "bg-red-500"; // 🔴 Perdido
      default:
        return "bg-gray-400";
    }
  };
  
  const getLeadStatusIcon = (status: string) => {
    switch (status) {
      case "OPEN":
        return "🚀";
      case "CONTACTED":
        return "📞";
      case "QUALIFIED":
        return "✅";
      case "CLOSED":
        return "🔒";
      case "LOST":
        return "❌";
      default:
        return "❓";
    }
  };
  
  // Obtener la última actividad de un contacto
  const getLastActivity = async (contactId: string) => {
    // Buscar el lead más reciente asociado al contacto
    const latestLead = await prisma.lead.findFirst({
      where: { contactId },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    });
  
    if (latestLead) return { date: latestLead.updatedAt, type: "Lead" };
  
    // Buscar la campaña más reciente en la que ha participado el contacto
    const latestCampaign = await prisma.campaign.findFirst({
      where: {
        contacts: { some: { id: contactId } },
      },
      orderBy: { date: "desc" },
      select: { date: true },
    });
  
    if (latestCampaign) return { date: latestCampaign.date, type: "Campaign" };
  
    // Buscar el evento más reciente en el que ha participado el contacto
    const latestEvent = await prisma.event.findFirst({
      where: {
        contacts: { some: { id: contactId } },
      },
      orderBy: { date: "desc" },
      select: { date: true },
    });
  
    if (latestEvent) return { date: latestEvent.date, type: "Event" };
  
    // Si no hay actividad
    return { date: "No tiene actividad asociada", type: "N/A" };
  };
  

const SingleContactPage = async ({ params: { id } }: { params: { id: string } }) => {

    const leadsByStatus = await prisma.lead.groupBy({
        by: ['status'],
        where: {
            contactId: id, // Filtra por el contacto específico
        },
        _count: {
            status: true,
        },
    });
   // Obtener el contacto
   const contact = await prisma.contact.findUnique({
    where: { id },
    include: { company: true },
  });
  
  if (!contact) {
    return notFound();
  } 

   // Obtener oportunidades generadas (Leads asociados al contacto)
   const totalLeads = await prisma.lead.count({
    where: {
      contactId: contact.id,
    },
  });

  if (!contact) {
    throw new Error("Contacto no encontrado");
  }

  const totalCampaigns = await prisma.campaign.count({
    where: {
      contacts: {
        some: {
          id: contact.id, // Asegúrate de que `contact` existe y tiene un `id`
        },
      },
    },
  });

  const totalEvents = await prisma.event.count({
    where: {
      contacts: {
        some: {
          id: contact.id, // Asegúrate de que `contact` existe y tiene un `id`
        },
      },
    },
  });

  // Calcular el monto total de pipeline generado por el jugador (suma de los montos de leads)
const totalPipeline = await prisma.lead.aggregate({
    where: {
        contactId: contact.id,
      },
    _sum: {
       value: true, // Suponiendo que la columna del monto en leads se llama "amount"
    },
 });
 
 // Si no hay leads, el valor por defecto será 0
 const pipelineAmount = totalPipeline._sum.value || 0;

 const getStatusClass = (lastActivity: Date | string) => {
    if (typeof lastActivity === "string") return "text-red-500";
    const daysSinceLastActivity = (new Date().getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24);
  
    if (daysSinceLastActivity < 30) return "text-green-500"; // Activo en el último mes
    if (daysSinceLastActivity < 90) return "text-yellow-500"; // Activo en los últimos 3 meses
    return "text-red-500"; // Inactivo más de 3 meses
  };
  
  const getActivityHistory = async (contactId: string) => {
    const latestLead = await prisma.lead.findFirst({
        where: { contactId }, // Filtrar por contacto en lugar de empresa
        orderBy: { updatedAt: "desc" },
        select: { updatedAt: true },
    });

    const latestCampaign = await prisma.campaign.findFirst({
        where: { contacts: { some: { id: contactId } } }, // Relación con Contact
        orderBy: { date: "desc" },
        select: { date: true },
    });

    const latestEvent = await prisma.event.findFirst({
        where: { contacts: { some: { id: contactId } } }, // Relación con Contact
        orderBy: { date: "desc" },
        select: { date: true },
    });

    return {
        lastLead: latestLead ? new Date(latestLead.updatedAt).toLocaleDateString("es-ES") : "Sin datos",
        lastCampaign: latestCampaign ? new Date(latestCampaign.date).toLocaleDateString("es-ES") : "Sin datos",
        lastEvent: latestEvent ? new Date(latestEvent.date).toLocaleDateString("es-ES") : "Sin datos"
    };
};

const { lastLead, lastCampaign, lastEvent } = await getActivityHistory(id);


  const getLastActivity = async (companyId: string) => {
    // Obtener la última actividad de la organización

    // Buscar el lead más reciente
    const latestLead = await prisma.lead.findFirst({
      where: { companyId },
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    });
  
    if (latestLead) return { date: latestLead.updatedAt, type: "Lead" };
  
    // Buscar la campaña más reciente en la que ha participado
    const latestCampaign = await prisma.campaign.findFirst({
      where: {
        contacts: { some: { companyId } },
      },
      orderBy: { date: "desc" },
      select: { date: true },
    });
  
    if (latestCampaign) return { date: latestCampaign.date, type: "Campaign" };
  
    // Buscar el evento más reciente en el que ha participado
    const latestEvent = await prisma.event.findFirst({
      where: {
        contacts: { some: { companyId } },
      },
      orderBy: { date: "desc" },
      select: { date: true },
    });
  
    if (latestEvent) return { date: latestEvent.date, type: "Event" };
  
    // Si no hay actividad
    return { date: "No tiene actividad asociada", type: "N/A" };
  };
  

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
                        <h1 className="text-xl font-semibold text-black">{contact.name}</h1>

                        {/* Información adicional en dos columnas */}
                        <div className="grid grid-cols-2 gap-x-0 gap-y-2 text-black text-sm self-end mr-8">
                           {/* Departamento */}
                           <div className="flex items-center gap-2">
                              <Image src="/department.png" alt="Department Icon" width={20} height={20} />
                              <span>{contact.company?.name}</span>
                           </div>
                           {/* Rol */}
                           <div className="flex items-center gap-2">
                                <Image src="/roleEmployee.png" alt="Role Icon" width={20} height={20} />
                                <span>{contact.role ? contact.role.replace(/_/g, " ") : "Sin rol"}</span>
                           </div>                           
                            {/* Phone */}
                            <div className="flex items-center gap-2">
                              <Image src="/mobilephone.png" alt="Phone Icon" width={20} height={20} />
                            <span>{contact.phone || "-"}</span>
                           </div>  
                            {/* Email */}
                            <div className="flex items-center gap-2">
                                 <Image src="/email.png" alt="Email Icon" width={20} height={20} />
                                 <span className="break-words whitespace-normal max-w-[110px]">
                                    {contact.email.replace("@", "@\u200B")}
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
                           src={"/noAvatar.png"}
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
                        <span className="text-sm text-gray-400">Leads</span>
                     </div>
                  </div>

                  {/* Tasa de conversión */}
                  <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                     <Image src="/funnel.png" alt="Conversion Rate" width={24} height={24} className="w-6 h-6" />
                     <div>
                        <h1 className="text-xl font-semibold">{totalEvents}</h1>
                        <span className="text-sm text-gray-400">Events</span>
                     </div>
                  </div>

                  {/* Campañas activas */}
                  <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                     <Image src="/campaigns.png" alt="Campaigns" width={24} height={24} className="w-6 h-6" />
                     <div>
                        <h1 className="text-xl font-semibold">{totalCampaigns}</h1>
                        <span className="text-sm text-gray-400">Campaigns</span>
                     </div>
                  </div>


                  {/* Pipeline generado */}
                  <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                     <Image src="/lastActivity.png" alt="Pipeline" width={24} height={24} className="w-6 h-6" />
                     <div>
                     <h1 className="text-xl font-semibold">
                        {pipelineAmount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                     </h1>
                        <span className="text-sm text-gray-400">Estimated Pipeline</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* BOTTOM */}
            <div className="mt-4 bg-white rounded-md p-4 h-[920px]">
            <div className="mb-6">
               <TableContactCampaigns contactId={id} />
            </div>
            <div>
               <TableContactLeads contactId={id} />
            </div>
            </div>            
         </div>

         {/* RIGHT */}
         <div className="w-full xl:w-1/3 flex flex-col gap-4">
    {/* CONTACT SNAPSHOT */}
    <div className="bg-gradient-to-br from-white/75 to-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-lg flex flex-col gap-6 border border-gray-300/50">
        {/* Título */}
        <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
            <h2 className="text-xl font-bold text-gray-800 tracking-wide">Contact Snapshot</h2>
            <span className={`text-sm font-semibold px-3 py-1 rounded-md ${getStatusClass(contact.status ?? "default")}`}>
                {contact.status ?? "Unknown"}
            </span>
        </div>

        {/* Información del contacto */}
        <div className="flex flex-col gap-4 text-gray-700">
            {/* Nombre */}
            <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                <div className="flex items-center gap-3">
                    <Image src="/employees.png" alt="User Icon" width={24} height={24} />
                    <span className="font-medium">Nombre:</span>
                </div>
                <span className="text-gray-900 font-semibold">{contact.name}</span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                <div className="flex items-center gap-3">
                    <Image src="/email.png" alt="Email Icon" width={24} height={24} />
                    <span className="font-medium">Email:</span>
                </div>
                <span className="text-gray-900 font-semibold">{contact.email}</span>
            </div>

            {/* Teléfono */}
            {contact.phone && (
                <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                    <div className="flex items-center gap-3">
                        <Image src="/mobilephone.png" alt="Phone Icon" width={24} height={24} />
                        <span className="font-medium">Teléfono:</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{contact.phone}</span>
                </div>
            )}

            {/* Rol */}
            {contact.role && (
                <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                    <div className="flex items-center gap-3">
                        <Image src="/role.png" alt="Role Icon" width={24} height={24} />
                        <span className="font-medium">Rol:</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{contact.role.replace(/_/g, " ")}</span>
                </div>
            )}

            {/* Empresa asociada */}
            {contact.company && (
                <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-3">
                        <Image src="/company.png" alt="Company Icon" width={24} height={24} />
                        <span className="font-medium">Empresa:</span>
                    </div>
                    <span className="text-gray-900 font-semibold">{contact.company.name}</span>
                </div>
            )}
        </div>
    </div>

    {/* Estado del pipeline */}
    <div className="bg-gradient-to-br from-white/70 to-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl w-full border border-gray-200/60">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            📊 Estado del Pipeline
        </h2>
        
        {leadsByStatus.length > 0 ? (
            <div className="flex flex-col gap-3">
                {leadsByStatus.map(({ status, _count }) => (
                    <div 
                        key={status} 
                        className={`flex items-center justify-between p-4 rounded-xl shadow-md ${getLeadStatusColor(status)} transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl"> {getLeadStatusIcon(status)} </span>
                            <span className="text-white font-medium tracking-wide">{status}</span>
                        </div>
                        <span className="text-white text-lg font-bold">{_count.status}</span>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex items-center justify-center h-24 bg-gray-100 text-gray-600 rounded-lg shadow-sm border border-gray-300">
                No hay oportunidades disponibles
            </div>
        )}
    </div>

    {/* Campañas en las que ha participado */}
    <div className="bg-gradient-to-br from-white/70 to-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-200/80">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            📅 Historial de Interacciones
        </h2>
        
        <div className="text-lg text-gray-800 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-gray-300/40 py-3">
                <span className="flex items-center gap-3 text-gray-700 tracking-wide">
                    📢 <span className="font-medium">Última Campaña:</span>
                </span>
                <span className="font-semibold text-gray-900">{lastCampaign}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-300/40 py-3">
                <span className="flex items-center gap-3 text-gray-700 tracking-wide">
                    🎟️ <span className="font-medium">Último Evento:</span>
                </span>
                <span className="font-semibold text-gray-900">{lastEvent}</span>
            </div>

            <div className="flex justify-between items-center py-3">
                <span className="flex items-center gap-3 text-gray-700 tracking-wide">
                    📈 <span className="font-medium">Último Lead:</span>
                </span>
                <span className="font-semibold text-gray-900">{lastLead}</span>
            </div>
        </div>
    </div>
</div>

      </div>
   );
};

export default SingleContactPage;