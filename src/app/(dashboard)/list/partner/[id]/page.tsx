import Image from "next/image";
import Link from "next/link";
import prisma from '@/lib/prisma';
import { notFound } from "next/navigation";
import TableOrganizationCampaigns from "@/components/Tables/TableOrganizationCampaigns";
import TablePartnerEvent from "@/components/Tables/TablePartnerEvent";
import TablePartnerCampaign from "@/components/Tables/TablePartnerCampaign";


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


  const getLastActivity = async (partnerId: string) => {
    try {
        if (!partnerId) return { date: "No tiene actividad asociada", type: "N/A" };

        // Buscar la última campaña y el último evento en paralelo
        const [latestCampaign, latestEvent] = await Promise.all([
            prisma.campaign.findFirst({
                where: { sponsors: { some: { id: partnerId } } },
                orderBy: { date: "desc" },
                select: { name: true, date: true },
            }),
            prisma.event.findFirst({
                where: { sponsors: { some: { id: partnerId } } },
                orderBy: { date: "desc" },
                select: { name: true, date: true },
            }),
        ]);

        // Determinar cuál actividad es más reciente
        if (!latestCampaign && !latestEvent) {
            return { date: "No tiene actividad asociada", type: "N/A" };
        }

        if (!latestEvent || (latestCampaign && latestCampaign.date > latestEvent.date)) {
            return {
                date: new Date(latestCampaign!.date).toLocaleDateString("es-ES"),
                type: "Campaign",
                name: latestCampaign!.name,
            };
        } else {
            return {
                date: new Date(latestEvent!.date).toLocaleDateString("es-ES"),
                type: "Event",
                name: latestEvent!.name,
            };
        }
    } catch (error) {
        console.error("Error obteniendo la última actividad del Partner:", error);
        return { date: "Error al obtener datos", type: "Error" };
    }
};


const SinglePartnerPage = async ({ params: { id } }: { params: { id: string } }) => {
       
    

     // Obtener el partner y el número de campaigns asociados
const partner = await prisma.partner.findUnique({
    where: { id },
    include: {
        contacts: {
            select: {
                name: true,
                email: true,
                phone: true,
            },
        },
        campaigns: true, // Esto traerá los leads, pero solo si los necesitas
        events: true, // Esto traerá los leads, pero solo si los necesitas
    },
});

if (!partner) {
    return notFound();
}



// Calcular el monto total de pipeline generado por el jugador (suma de los montos de leads)
const totalPipeline = await prisma.lead.aggregate({
    where: {
       companyId: id
    },
    _sum: {
       value: true, // Suponiendo que la columna del monto en leads se llama "amount"
    },
 });
 
 // Si no hay leads, el valor por defecto será 0
 const pipelineAmount = totalPipeline._sum.value || 0;

 // Calcular el numero de campañas en las que ha participado
 const totalCampaigns = await prisma.campaign.count({
    where: {
        sponsors: { some: { id: partner.id } }, // Verifica si el Partner está en la lista de sponsors
    },
});

// Calcular el numero de campañas en las que ha participado
const totalEvents = await prisma.event.count({
    where: {
        sponsors: { some: { id: partner.id } }, // Verifica si el Partner está en la lista de sponsors
    },
});


   // Obtener la última actividad de la organización
   const { date: lastActivityDate, type: lastActivityType } = await getLastActivity(id);

   

   const getActivityHistory = async (partnerId: string) => {
    if (!partnerId) return { lastLead: "Sin datos", lastCampaign: "Sin datos", lastEvent: "Sin datos" };

    try {
        const [latestLead, latestCampaign, latestEvent] = await Promise.all([
            prisma.lead.findFirst({
                where: {
                    OR: [
                        { campaign: { sponsors: { some: { id: partnerId } } } }, 
                        { event: { sponsors: { some: { id: partnerId } } } }
                    ]
                },
                orderBy: { updatedAt: "desc" },
                select: { updatedAt: true },
            }),
            prisma.campaign.findFirst({
                where: { sponsors: { some: { id: partnerId } } },
                orderBy: { date: "desc" },
                select: { name: true, date: true },
            }),
            prisma.event.findFirst({
                where: { sponsors: { some: { id: partnerId } } },
                orderBy: { date: "desc" },
                select: { name: true, date: true },
            }),
        ]);

        return {
            lastLead: latestLead?.updatedAt ? new Date(latestLead.updatedAt).toLocaleDateString("es-ES") : "Sin datos",
            lastCampaign: latestCampaign?.date ? new Date(latestCampaign.date).toLocaleDateString("es-ES") : "Sin datos",
            lastEvent: latestEvent?.date ? new Date(latestEvent.date).toLocaleDateString("es-ES") : "Sin datos"
        };
    } catch (error) {
        console.error("Error obteniendo historial de actividad:", error);
        return { lastLead: "Error", lastCampaign: "Error", lastEvent: "Error" };
    }
};

console.log("Company ID recibido:", id);
const { lastLead, lastCampaign, lastEvent } = id 
  ? await getActivityHistory(id) 
  : { lastLead: "Sin datos", lastCampaign: "Sin datos", lastEvent: "Sin datos" };

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
                        <div className="h-2/3 bg-white flex flex-col items-center justify-center gap-2 ">
                            {/* Nombre */}
                            <h1 className="text-xl font-semibold text-black mr-6">{partner.name}</h1>
                            {/* Información adicional en dos columnas */}
                            <div className="grid grid-cols-2 gap-x-0 gap-y-2 text-black text-sm self-center ml-24">
                              {/* Industry */}
                              <div className="flex items-center gap-2">
                                <Image src="/company.png" alt="Department Icon" width={20} height={20} />
                                <span>{partner.industry}</span>
                              </div>
                              {/* Nombre Contacto */}
                              <div className="flex items-center gap-2">
                                <Image src="/roleemployee.png" alt="Email Icon" width={20} height={20} />
                                <span >
                                     {partner.contacts[0]?.name || "No contact available"}
                                </span>
                              </div>
                              {/* Phone */}
                              <div className="flex items-center gap-2">
                                <Image src="/mobilephone.png" alt="Phone Icon" width={20} height={20} />
                                <span>{partner.contacts[0]?.phone || "No phone available"}</span>
                              </div>  
                              
                               {/* Contact Email */}
                               <div className="flex items-center gap-2">
                                <Image src="/email.png" alt="Role Icon" width={20} height={20} />
                                <span className="break-words whitespace-normal max-w-[110px]">
                                    {partner.contacts[0]?.email.replace("@", "@\u200B") || "No email available"}
                                </span>
                              </div>            
                                             
                            </div>    
                            {/* Línea separadora */}
                            <div className="w-full border-b border-gray-300 mt-18"></div>
                                {/* Opciones de enlaces */}
                                
                                <ul className="w-full flex justify-between px-14  text-sm text-gray-700 mb-2">
                                <li>
                                    <Link 
                                      href="/" 
                                      className="bg-black text-white px-4 py-0 rounded-full cursor-pointer"
                                    >
                                      Inicio
                                    </Link>

                                </li>
                                <li>
                                <Link 
                                      href="/" 
                                      className="bg-black text-white px-4 py-0 rounded-full cursor-pointer"
                                    >
                                      Events
                                </Link>
                                </li>
                                <li>
                                <Link 
                                      href="/" 
                                      className="bg-black text-white px-4 py-0 rounded-full cursor-pointer"
                                    >
                                      Campaigns
                                    </Link>
                                </li>
                                <li>
                                <Link 
                                      href="/" 
                                      className="bg-black text-white px-4 py-0 rounded-full cursor-pointer"
                                    >
                                      Website
                                    </Link>
                                </li>
                                </ul>

                            </div>
                        </div>
                    {/* Contenido de la tarjeta */}
                    <div className="relative flex w-full p-6 ">
                        {/* Imagen de usuario */}
                          <div className="w-1/3 flex items-center justify-center">
                            <Image
                              src= "/NFL_logo.png"
                              alt="User Avatar"
                              width={144}
                              height={144}
                              className="w-34 h-36 rounded-md object-cover border-4 border-white mr-16"
                            />
                          </div> 
                                                  
                    </div>                                
               </div>

               {/* SMALL CARDS */}
               <div className="flex-1 flex gap-4 justify-between flex-wrap">
                  {/* Campañas en las que ha participado */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                    <Image src="/campaigns.png" alt="Campaigns" width={24} height={24} className="w-6 h-6" />
                    <div>
                        <h1 className="text-xl font-semibold">{totalCampaigns}</h1>
                        <span className="text-sm text-gray-400">Campaigns Participated</span>
                    </div>
                    </div>

                    {/* Leads generados */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                    <Image src="/funnel.png" alt="Leads" width={24} height={24} className="w-6 h-6" />
                        <div>
                            <h1 className="text-xl font-semibold">{totalEvents}</h1>
                            <span className="text-sm text-gray-400">Events Participated</span>
                        </div>
                    </div>

                    {/* Pipeline generado */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                    <Image src="/finances.png" alt="Pipeline" width={24} height={24} className="w-6 h-6" />
                    <div>
                        <h1 className="text-xl font-semibold">
                          €
                        </h1>
                        <span className="text-sm text-gray-400">Pipeline Generated</span>
                    </div>
                    </div>

                    {/* Última Actividad */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
                        <Image src="/lastActivity.png" alt="Last Activity" width={24} height={24}  className="w-6 h-6"/>
                        <div>
                            <h1 className="text-xl font-semibold">
                                {typeof lastActivityDate === "string"
                                    ? lastActivityDate
                                    : new Date(lastActivityDate).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}
                            </h1>
                            <span className="text-sm text-gray-400">Last Interaction ({lastActivityType})</span>
                        </div>
                    </div>

               </div>
            </div>

            {/* BOTTOM: Aquí podrías incluir tablas u otro contenido relacionado */}
            <div className="mt-4 bg-white rounded-md p-4 h-[430px]">
                <TablePartnerEvent partnerId={id} />
            </div>
            <div className="mt-4 bg-white rounded-md p-4 h-[430px]">
                <TablePartnerCampaign partnerId={id} />
            </div>
         </div>

         {/* RIGHT */}
         <div className="w-full xl:w-1/3 flex flex-col gap-4">
            {/* CUSTOMER SNAPSHOT */}
            <div className="bg-gradient-to-br from-white/75 to-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-lg flex flex-col gap-6 border border-gray-300/50">
                {/* Título */}
                <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                    <h2 className="text-xl font-bold text-gray-800 tracking-wide">Customer Snapshot</h2>
                    
                </div>

                {/* Información de la empresa */}
                <div className="flex flex-col gap-4 text-gray-700">
                    {/* Industria */}
                    <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                        <div className="flex items-center gap-3">
                            <Image src="/organizations.png" alt="Industry Icon" width={24} height={24} />
                            <span className="font-medium">Industria:</span>
                        </div>
                        <span className="text-gray-900 font-semibold">{partner.industry}</span>
                    </div>
                    {/* Country */}

                    <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                        <div className="flex items-center gap-3">
                            <Image src="/location.png" alt="Industry Icon" width={24} height={24} />
                            <span className="font-medium">País:</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Image
                                src={getFlagImageUrl(partner.country)}
                                alt={partner.country}
                                width={24}
                                height={16}
                                className="rounded-sm border border-gray-300"
                            />
                            <span className="text-gray-900 font-semibold">{partner.country}</span>
                        </div>                        
                    </div>
                    {/* Ciudad */}
                    <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                        <div className="flex items-center gap-3">
                            <Image src="/city.png" alt="Industry Icon" width={24} height={24} />
                            <span className="font-medium">Ciudad:</span>
                        </div>
                        <span className="text-gray-900 font-semibold">{partner.city}</span>
                    </div>

                    {/* Tamaño de empresa */}
                    <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                        <div className="flex items-center gap-3">
                            <Image src="/employees.png" alt="Employees Icon" width={24} height={24} />
                            <span className="font-medium">Tamaño:</span>
                        </div>
                        <span className="text-gray-900 font-semibold"> empleados</span>
                    </div>

                    {/* Última actividad */}
                    <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center gap-3">
                            <Image src="/lastActivity.png" alt="Last Activity" width={24} height={24} />
                            <span className="font-medium">Última actividad:</span>
                        </div>
                        <span className="text-gray-900 font-semibold">
                            {typeof lastActivityDate === "string"
                                ? lastActivityDate
                                : new Date(lastActivityDate).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Estado del pipeline */}
            <div className="bg-gradient-to-br from-white/70 to-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl w-full border border-gray-200/60">
                
                
                
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
                        <span className="font-semibold text-gray-900">No Leads</span>
                    </div>
                </div>
            </div>
         </div>
      </div>
   )    
}

export default SinglePartnerPage