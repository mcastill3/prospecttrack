import Image from "next/image";
import prisma  from "@/lib/prisma";
import CampaignsTable from "@/components/Tables/TableCampaigns";

const SingleCampaignPage = async ({ params }: { params: { id: string } }) => {

const getCampaignDetails = async (id: string) => {
 return await prisma.campaign.findUnique({
      where: { id },
    });
  };
  

 const campaign = await getCampaignDetails(params.id);
  
  if (!campaign) {
    return <p className="text-red-500">Campaña no encontrada</p>;
  }

const getLeadsCountByCampaign = async (campaignId: string) => {
  const leadsCount = await prisma.lead.count({
    where: { campaignId },
  });
    
  return leadsCount;
  };

  const leadsCount = await getLeadsCountByCampaign(params.id);
  const getTotalLeadValueByCampaign = async (campaignId: string) => {
    const pipelineAmount = await prisma.lead.aggregate({
      _sum: {
        value: true, // Sumar el campo value
      },
      where: { campaignId },
    });
  
    return pipelineAmount._sum.value || 0; // Si no hay leads, devuelve 0
  };  
  
  const pipelineAmount = await getTotalLeadValueByCampaign(params.id);

  const getTotalCostByCampaign = async (campaignId: string) => {
    const totalCost = await prisma.cost.aggregate({
      _sum: {
        amount: true, // Sumar el campo "amount"
      },
      where: {
        campaign: {
          some: { id: campaignId }, // Filtrar por el ID de la campaña
        },
      },
    });
  
    return totalCost._sum.amount || 0; // Si no hay costos, devuelve 0
  };
  
  const totalCost = await getTotalCostByCampaign(params.id);


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
                              {/* Nombre de la campaña */}
                              <h1 className="text-2xl font-bold text-black text-center mb-2 mr-2">{campaign.name}</h1>

                              {/* Contenedor con dos columnas bien separadas */}
                              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-black text-sm self-end mr-28">
                                {/* Tipo */}
                                <div className="flex items-center gap-2">
                                  <Image src="/company.png" alt="Department Icon" width={20} height={20} />
                                  <span className="font-medium">{campaign.type}</span>
                                </div>

                                {/* Contactos objetivo */}
                                <div className="flex items-center gap-2">
                                  <Image src="/roleemployee.png" alt="Email Icon" width={20} height={20} />                                 
                                  <span>{campaign.targetContacts || "Contactos no incluidos"}</span>
                                </div>

                                {/* Fecha */}
                                <div className="flex items-center gap-2">
                                  <Image src="/mobilephone.png" alt="Phone Icon" width={20} height={20} />
                                  <span>{campaign.date ? new Date(campaign.date).toLocaleDateString("es-ES") : "Sin fecha"}</span>
                                </div>  

                                {/* Estado */}
                                <div className="flex items-center gap-2">
                                  <Image src="/email.png" alt="Role Icon" width={20} height={20} />
                                  <span className="break-words whitespace-normal max-w-[140px] font-semibold text-blue-600">
                                    {campaign.status.replace(/_/g, " ")}
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
                  {/* Attendance */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                    <Image src="/campaigns.png" alt="Campaigns" width={24} height={24} className="w-6 h-6" />
                    <div>
                        <h1 className="text-xl font-semibold">{campaign.targetContacts}</h1>
                        <span className="text-sm text-gray-400">Attendance</span>
                    </div>
                    </div>

                    {/* Leads generados */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                    <Image src="/funnel.png" alt="Leads" width={24} height={24} className="w-6 h-6" />
                        <div>
                            <h1 className="text-xl font-semibold">{leadsCount}</h1>
                            <span className="text-sm text-gray-400">Leads Generated</span>
                        </div>
                    </div>

                    {/* Pipeline generado */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
                    <Image src="/finances.png" alt="Pipeline" width={24} height={24} className="w-6 h-6" />
                    <div>
                        <h1 className="text-xl font-semibold">
                         {pipelineAmount.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </h1>
                        <span className="text-sm text-gray-400">Pipeline Generated</span>
                    </div>
                    </div>

                    {/* Última Actividad */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%]">
                        <Image src="/lastActivity.png" alt="Last Activity" width={24} height={24}  className="w-6 h-6"/>
                        <div>
                        <h1 className="text-xl font-semibold">
                         {totalCost.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                        </h1>
                          <span className="text-sm text-gray-400">Costo</span>
                        </div>
                    </div>

               </div>
            </div>

            {/* BOTTOM: Aquí podrías incluir tablas u otro contenido relacionado */}
            <div className="mt-4 bg-white rounded-md p-4 h-[430px]">
                <CampaignsTable />
            </div>
            <div className="mt-4 bg-white rounded-md p-4 h-[430px]">
                TableOrganizationCampaigns  
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
                        <span className="text-gray-900 font-semibold"></span>
                    </div>
                    {/* Country */}

                    <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                        <div className="flex items-center gap-3">
                            <Image src="/location.png" alt="Industry Icon" width={24} height={24} />
                            <span className="font-medium">País:</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Image
                                src="/{getFlagImageUrl(company.country)}"
                                alt="{company.country}"
                                width={20}
                                height={20}
                                className="rounded-sm border border-gray-300"
                            />
                            <span className="text-gray-900 font-semibold"></span>
                        </div>                        
                    </div>
                    {/* Ciudad */}
                    <div className="flex items-center justify-between border-b border-gray-300/40 pb-3">
                        <div className="flex items-center gap-3">
                            <Image src="/city.png" alt="Industry Icon" width={24} height={24} />
                            <span className="font-medium">Ciudad:</span>
                        </div>
                        <span className="text-gray-900 font-semibold"></span>
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
                        
                    </div>
                </div>
            </div>

            {/* Estado del pipeline */}
            <div className="bg-gradient-to-br from-white/70 to-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl w-full border border-gray-200/60">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    📊 Estado del Pipeline
                </h2>
                
                
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
                        <span className="font-semibold text-gray-900"></span>
                    </div>

                    <div className="flex justify-between items-center border-b border-gray-300/40 py-3">
                        <span className="flex items-center gap-3 text-gray-700 tracking-wide">
                            🎟️ <span className="font-medium">Último Evento:</span>
                        </span>
                        <span className="font-semibold text-gray-900"></span>
                    </div>

                    <div className="flex justify-between items-center py-3">
                        <span className="flex items-center gap-3 text-gray-700 tracking-wide">
                            📈 <span className="font-medium">Último Lead:</span>
                        </span>
                        <span className="font-semibold text-gray-900"></span>
                    </div>
                </div>
            </div>
         </div>
      </div> 
  )
}
export default SingleCampaignPage;
