import Image from "next/image";
import prisma  from "@/lib/prisma";
import TableOrganizationLeads from "@/components/Tables/TableOrganizationLeads";
import TableOrganizationCampaigns from "@/components/Tables/TableOrganizationCampaigns";

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

  

const SingleLeadPage = async ({ params }: { params: { id: string } }) => {

    const getLeadDetails = async (id: string) => {
        return await prisma.lead.findUnique({
            where: { id },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        industry: true,
                        country: true,
                        city: true,
                        size: true,
                        _count: { select: { leads: true } }, // Contar los leads asociados a la compañía
                        leads: {
                            select: {
                                id: true,
                                value: true,
                                status: true, // Asegurar que el status esté disponible
                            },
                            orderBy: {
                                status: "asc", // Ordenar los leads por status (ascendente)
                            },
                        },
                    },
                },
                contact: {
                    select: {
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
    };
    
    // Obtenemos los detalles del lead
    const lead = await getLeadDetails(params.id);
    
    // Validamos que lead no sea null
    if (!lead) {
        return <p className="text-red-500">Lead no encontrado</p>;
    }
   
    // Calculamos el número total de leads de la empresa
    const leadsCount = lead.company?._count.leads ?? 0;
    
    // Suma total de los valores de los leads
    const totalLeadValue = lead.company?.leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    
    // Función para agrupar los leads por estado
    const groupLeadsByStatus = (leads: { status: string }[]) => {
        return leads.reduce((acc, lead) => {
            acc[lead.status] = (acc[lead.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    };
    
    // Agrupamos los leads
    const groupedLeads = groupLeadsByStatus(lead.company?.leads || []);

    const leadsByStatus = Object.entries(groupedLeads).map(([status, count]) => ({
        status,
        _count: { status: count }
    }));

    // Función para determinar el estado de la empresa según la última actividad
const getStatusLabel = (lastActivity: Date | string) => {
    if (typeof lastActivity === "string") return "🔴 Inactivo"; // Si no tiene actividad
    const daysSinceLastActivity = (new Date().getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24);
  
    if (daysSinceLastActivity < 30) return "🟢 Activo";
    if (daysSinceLastActivity < 90) return "🟡 En riesgo";
    return "🔴 Inactivo";
  };
  
  // Función para asignar clases de color al estado
  const getStatusClass = (lastActivity: Date | string) => {
    if (typeof lastActivity === "string") return "text-red-500";
    const daysSinceLastActivity = (new Date().getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24);
  
    if (daysSinceLastActivity < 30) return "text-green-500";
    if (daysSinceLastActivity < 90) return "text-yellow-500";
    return "text-red-500";
  };
    
  const getActivityHistory = async (companyId: string) => {
    if (!companyId) {
        return { lastCampaign: "Sin datos", lastLead: "Sin datos", lastEvent: "Sin datos" };
    }

    try {
        // Buscar la última campaña asociada a la compañía a través de los leads
        const latestCampaign = await prisma.campaign.findFirst({
            where: {
                leads: { some: { companyId } },
            },
            orderBy: { date: "desc" },
            select: { name: true, date: true },
        });

        // Buscar el lead más reciente basado en la fecha de creación
        const latestLead = await prisma.lead.findFirst({
            where: { companyId },
            orderBy: { createdAt: "desc" },
            select: { name: true, createdAt: true },
        });

        // Buscar el evento más reciente basado en la fecha del evento
        const latestEvent = await prisma.event.findFirst({
            where: {
                leads: { some: { companyId } },
            },
            orderBy: { date: "desc" },
            select: { name: true, date: true },
        });

        return {
            lastCampaign: latestCampaign?.name
                ? `${latestCampaign.name} (${new Date(latestCampaign.date).toLocaleDateString("es-ES")})`
                : "Sin datos",
            lastLead: latestLead?.name
                ? `${latestLead.name} (${new Date(latestLead.createdAt).toLocaleDateString("es-ES")})`
                : "Sin datos",
            lastEvent: latestEvent?.name
                ? `${latestEvent.name} (${new Date(latestEvent.date).toLocaleDateString("es-ES")})`
                : "Sin datos",
        };
    } catch (error) {
        console.error("Error obteniendo historial de actividad:", error);
        return { lastCampaign: "Error", lastLead: "Error", lastEvent: "Error" };
    }
};

// Llamada a la función
const history = lead.company?.id
    ? await getActivityHistory(lead.company.id)
    : { lastCampaign: "Sin datos", lastLead: "Sin datos", lastEvent: "Sin datos" };

const { lastCampaign, lastLead, lastEvent } = history;

return (
<div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
         {/* LEFT */}
         <div>
            {/* TOP */}
            <div className="flex flex-col lg:flex-row gap-4 h-[270px] w-[1200px]">
               {/* Organization Info Card */}
               <div className="relative rounded-md flex-1 flex gap-4 overflow-hidden">
                    {/* Fondo dividido: Imagen con overlay arriba, blanco abajo */}
                    <div className="absolute inset-0 h-full w-full">
                      <div className="h-2/5 bg-cover bg-center relative" style={{ backgroundImage: "url('/background.jpg')" }}>
                           {/* Overlay oscuro para mejorar legibilidad */}
                           <div className="absolute inset-0 bg-black opacity-10"></div>
                      </div>
                            {/* Información de la Organización */}
                            <div className="h-3/5 bg-white flex flex-col items-center justify-center gap-4 p-6 rounded-lg shadow-lg">
                              {/* Nombre del Lead */}
                              <h1 className="text-2xl font-bold text-black text-center mb-2 mr-2">{lead.name}</h1>

                              {/* Contenedor con dos columnas bien separadas */}
                              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-black text-sm self-end mr-28">
                                {/* Status */}
                                <div className="flex items-center gap-2">
                                  <Image src="/company.png" alt="Department Icon" width={20} height={20} />
                                  <span className="font-medium">{lead.status}</span>
                                </div>

                                {/* Contactos objetivo */}
                                <div className="flex items-center gap-2">
                                  <Image src="/roleemployee.png" alt="Email Icon" width={20} height={20} />                                 
                                  <span>{lead.contact?.name || "Contacto no incluido"}</span>
                                </div>

                                {/* Fecha creación */}
                                <div className="flex items-center gap-2">
                                  <Image src="/mobilephone.png" alt="Phone Icon" width={20} height={20} />
                                  <span>{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString("es-ES") : "Sin fecha"}</span>
                                </div>  

                                {/* Company */}
                                <div className="flex items-center gap-2">
                                  <Image src="/email.png" alt="Role Icon" width={20} height={20} />
                                  <span className="break-words whitespace-normal max-w-[140px] font-semibold text-blue-600">
                                    {lead.company?.name || "Sin compañía"}
                                  </span>
                                </div>            
                              </div>    
                            </div>                        
                        </div>
                    {/* Contenido de la tarjeta */}
                    <div className="relative flex w-full p-6 ">
                        {/* Imagen de usuario */}
                          <div className="w-1/3 flex items-center justify-center">
                            <Image
                              src= "/logo.png"
                              alt="User Avatar"
                              width={144}
                              height={144}
                              className="w-30 h-30 rounded-md object-cover border-4 border-white mr-16"
                            />
                          </div>                                                   
                    </div>                                
               </div>

               {/* SMALL CARDS */}
               <div className="flex-1 flex gap-4 justify-between flex-wrap">
                {/* Leads generados */}
                <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                    <Image src="/funnel.png" alt="Leads" width={24} height={24} className="w-6 h-6" />
                        <div>
                            <h1 className="text-xl font-semibold">{leadsCount}</h1>
                            <span className="text-sm text-gray-400">Otros Leads</span>
                        </div>
                    </div>
                  {/* Value en Euros */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                    <Image src="/campaigns.png" alt="Campaigns" width={24} height={24} className="w-6 h-6" />
                    <div>
                    <h1 className="text-xl font-semibold">
                      {lead.value?.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </h1>
                        <span className="text-sm text-gray-400">{lead.name}</span>
                    </div>
                    </div>                    

                    {/* Pipeline generado */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                    <Image src="/finances.png" alt="Pipeline" width={24} height={24} className="w-6 h-6" />
                    <div>
                        <h1 className="text-xl font-semibold">
                         {// Suma total de los valores de los leads
                           totalLeadValue?.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </h1>
                        <span className="text-sm text-gray-400">{lead.company?.name}</span>
                         <div>
                           <span className="text-sm text-gray-400">Pipeline Generated</span>
                         </div>                        
                    </div>
                    </div>

                    {/* Última Actividad */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
                        <Image src="/lastActivity.png" alt="Last Activity" width={24} height={24}  className="w-6 h-6"/>
                        <div>
                         <div>
                          <span>{lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString("es-ES") : "Sin fecha"}</span>
                         </div>
                            <span className="text-sm text-gray-400">Last Interaction</span>
                        </div>
                    </div>

               </div>
            </div>

            {/* BOTTOM: Aquí podrías incluir tablas u otro contenido relacionado */}
            <div className="mt-4 bg-white rounded-md p-4 h-[430px]">
                <TableOrganizationLeads companyId={lead.company?.id || "No tiene Leads asociados"} />
            </div>
            <div className="mt-4 bg-white rounded-md p-4 h-[430px]">
               <TableOrganizationCampaigns companyId={lead.company?.id || "No tiene Campaigns asociados"} />  
            </div>
         </div>

         {/* RIGHT */}
         <div className="w-full xl:w-1/3 flex flex-col gap-4">
            {/* CUSTOMER SNAPSHOT */}
            <div className="bg-gradient-to-br from-white/75 to-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-lg flex flex-col gap-6 border border-gray-300/50">
                {/* Título */}
                <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                    <h2 className="text-xl font-bold text-gray-800 tracking-wide">Customer Snapshot</h2>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-md`}>
                        
                    </span>
                </div>

                {/* Información de la empresa */}
                <div className="flex flex-col gap-4 text-gray-700">
                    {/* Industria */}
                    <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                        <div className="flex items-center gap-3">
                            <Image src="/organizations.png" alt="Industry Icon" width={24} height={24} />
                            <span className="font-medium">Industria:</span>
                        </div>
                        <span className="text-gray-900 font-semibold">{lead.company?.industry}</span>
                    </div>
                    {/* Country */}

                    <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                        <div className="flex items-center gap-3">
                            <Image src="/location.png" alt="Industry Icon" width={24} height={24} />
                            <span className="font-medium">País:</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Image
                                src={getFlagImageUrl(lead.company?.country || "")}
                                alt={lead.company?.country || "Unknown Country"}
                                width={20}
                                height={20}
                                className="rounded-sm border border-gray-300"
                            />
                            <span className="text-gray-900 font-semibold">{lead.company?.country}</span>
                        </div>                        
                    </div>
                    {/* Ciudad */}
                    <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                        <div className="flex items-center gap-3">
                            <Image src="/city.png" alt="Industry Icon" width={24} height={24} />
                            <span className="font-medium">Ciudad:</span>
                        </div>
                        <span className="text-gray-900 font-semibold">{lead.company?.city}</span>
                    </div>

                    {/* Tamaño de empresa */}
                    <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                        <div className="flex items-center gap-3">
                            <Image src="/employees.png" alt="Employees Icon" width={24} height={24} />
                            <span className="font-medium">Tamaño:</span>
                        </div>
                        <span className="text-gray-900 font-semibold">{lead.company?.size} empleados</span>
                    </div>

                    {/* Última actividad */}
                    <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center gap-3">
                            <Image src="/lastActivity.png" alt="Last Activity" width={24} height={24} />
                            <span className="font-medium">Última actividad:</span>
                        </div>
                        <span className="text-gray-900 font-semibold">{lead.updatedAt ? new Date(lead.updatedAt).toLocaleDateString("es-ES") : "Sin fecha"}</span>
                        
                    </div>
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


            {/* Actividades en las que ha participado */}
           {/* Actividades en las que ha participado */}
            <div className="bg-white/80 backdrop-blur-lg p-4 rounded-lg shadow-md border border-gray-200/70 max-w-md">
                <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    📅 Historial de Interacciones
                </h2>

                <div className="text-sm text-gray-800 space-y-3">
                    {[
                        { icon: "📢", label: "Última Campaña", value: lastCampaign },
                        { icon: "🎟️", label: "Último Evento", value: lastEvent },
                        { icon: "📈", label: "Último Lead", value: lastLead },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-start py-2 ${
                                index !== 2 ? "border-b border-gray-300/30" : ""
                            }`}
                        >
                            <span className="flex items-center gap-2 text-gray-700">
                                {item.icon} <span className="font-medium">{item.label}:</span>
                            </span>
                            <span className="font-medium text-gray-900 text-right flex flex-col">
                                {item.value.split(" (")[0]}
                                <span className="text-md text-gray-500">
                                    ({item.value.split(" (")[1]?.replace(")", "")})
                                </span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div> 
  )
}
export default SingleLeadPage;