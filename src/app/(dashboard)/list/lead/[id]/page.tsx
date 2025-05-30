import Image from "next/image";
import prisma  from "@/lib/prisma";
import TableOrganizationLeads from "@/components/Tables/TableOrganizationLeads";
import { Card, CardContent } from "@/components/ui/card";

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
    const latestCampaign = await prisma.activity.findFirst({
  where: {
    activityContacts: {
      some: {
        contact: {
          companyId: companyId
        }
      }
    }
  },
  orderBy: {
    date: "desc"
  },
  select: {
    date: true,
    type: true
  }
});

  
    if (latestCampaign) return { date: latestCampaign.date, type: "Campaign" };
  }
    
const SingleLeadPage = async ({ params }: { params: { id: string } }) => {

    const getLeadDetails = async (id: string) => {
        return await prisma.lead.findUnique({
            where: { id },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        sector: true,
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
                        firstName: true,
                        lastName: true,
                        email: true,
                        jobTitle: true,
                        phone1: true,
                    },
                },
                accountManager: {
                  select: {
                    firstName: true,
                    lastName: true,
                    country: true,
                    city: true,
                  }
                }
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
        const latestCampaign = await prisma.activity.findFirst({
            where: {
                leads: { some: { companyId } },
            },
            orderBy: { date: "desc" },
            select: { type: true, date: true },
        });

        // Buscar el lead más reciente basado en la fecha de creación
        const latestLead = await prisma.lead.findFirst({
            where: { companyId },
            orderBy: { createdAt: "desc" },
            select: { name: true, createdAt: true },
        });


        return {
            lastCampaign: latestCampaign?.type
                ? `${latestCampaign.type} (${new Date(latestCampaign.date).toLocaleDateString("es-ES")})`
                : "Sin datos",
            lastLead: latestLead?.name
                ? `${latestLead.name} (${new Date(latestLead.createdAt).toLocaleDateString("es-ES")})`
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
<>  
<div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
  {/* TOP - Lead Info Card */}
  <div className="flex flex-col lg:flex-row gap-4 h-[225px] w-full">
    <div className="relative rounded-md flex-1 flex gap-4 overflow-hidden">
      {/* Fondo dividido */}
      <div className="absolute inset-0 h-full w-full">
        <div className="h-2/5 bg-cover bg-center relative" style={{ backgroundImage: "url('/background.jpg')" }}>
          <div className="absolute inset-0 bg-black opacity-10"></div>
        </div>
        <div className="h-2/5 bg-white flex flex-col items-end justify-center gap-4 p-6 shadow-md border border-gray-200">
          <h2 className="text-sm uppercase text-gray-500 tracking-wider">Lead Details</h2>
          <h1 className="text-2xl font-semibold text-gray-800">{lead.name}</h1>
        </div>
      </div>
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

  {/* SMALL CARDS */}
  <div className="flex flex-row gap-4 justify-between w-full overflow-x-auto">
    {/* Card 1 */}
    <Card className="py-2 px-3 flex gap-4 w-[24%] flex-1 min-w-[220px] h-[180px] relative">
      <CardContent className="flex flex-col gap-3 p-0">
        <span className="text-sm text-gray-400 text-left">Company Info</span>
        <h1 className="text-sm text-gray-400 font-semibold text-left w-full">{lead.company?.name}</h1>
        <h1 className="text-sm text-gray-400 font-semibold text-left w-full">
          {lead.company?.sector?.replace(/_/g, ' ')}
        </h1>
        <span className="text-sm text-gray-400 font-semibold">
          {lead.company?.size ? lead.company.size.toLocaleString("de-DE") : 'N/A'} - Employees
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
    <Card className="py-2 px-3 flex gap-4 max-w-[45%] flex-1 min-w-[220px] h-[180px] relative">
      <CardContent className="flex flex-col gap-3 p-0">
        <span className="text-sm text-gray-400 text-left">Total Leads</span>
        <h1 className="text-lg font-semibold text-left w-full">{leadsCount}</h1>
        <span className="text-sm text-gray-400 font-semibold">
          {lead.accountManager?.firstName} {lead.accountManager?.lastName || 'Sin nombre'}
        </span>
        <span className="text-sm text-gray-400 font-semibold">
          {lead.accountManager?.country?.name || 'Unknown Country'} - {lead.accountManager?.city?.name || 'Unknown City'}
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
    <Card className="py-2 px-3 flex gap-4 max-w-[45%] flex-1 min-w-[220px] h-[180px] relative">
      <CardContent className="flex flex-col gap-3 p-0">
        <span className="text-sm text-gray-400 text-left">Contact Info</span>
        <h1 className="text-sm text-gray-400 font-semibold text-left w-full">{lead.contact?.firstName} {lead.contact?.lastName}</h1>
        <h1 className="text-sm text-gray-400 font-semibold text-left w-full">{lead.contact?.jobTitle}</h1>
        <span className="text-sm text-gray-400 font-semibold">{lead.contact?.email || 'No email'}</span>
        <span className="text-sm text-gray-400 font-semibold">{lead.contact?.phone1 || 'No phone'}</span>
        <div className="absolute right-4 bottom-6">
          <img src="/logo.png" alt="Account Manager" className="w-12 h-12 rounded-full border-2 border-white" />
        </div>
      </CardContent>
      <div className="absolute bottom-0 left-0 w-full h-[8px] flex rounded-xl overflow-hidden">
        <div className="w-[70%] h-full bg-[#6900EE]"></div>
        <div className="w-[30%] h-full bg-black"></div>
      </div>
    </Card>
  </div>
</div>

{/* BOTTOM: Aquí podrías incluir tablas u otro contenido relacionado */}
<div className="mb-4 bg-white rounded-md p-4 h-[430px]">
  <TableOrganizationLeads companyId={lead.company?.id || "No tiene Leads asociados"} />
</div>
</>
  )
}
export default SingleLeadPage;