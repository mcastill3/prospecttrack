import prisma from "@/lib/prisma";
import Image from "next/image";

const CiclosCard = async ({ type }: { type: "leads" | "conversion" | "tiempo" | "comercial" }) => {
  let data: number | string = 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (type === "conversion") {
    const totalClosedLeads = await prisma.lead.count({
      where: { status: "CLOSED" },
    });

    const totalLeads = await prisma.lead.count();

    const conversionRate = totalLeads > 0 ? (totalClosedLeads / totalLeads) * 100 : 0;
    data = Math.round(conversionRate) + "%";
  } else if (type === "tiempo") {
    // Usar `_max` en lugar de `_avg`
    const result = await prisma.lead.aggregate({
      _max: {
        updatedAt: true,
        createdAt: true,
      },
      where: { status: "CLOSED" },
    });

    if (result._max.createdAt && result._max.updatedAt) {
      const tiempoPromedio =
        (new Date(result._max.updatedAt).getTime() - new Date(result._max.createdAt).getTime()) /
        (1000 * 60 * 60 * 24);

      data = `${Math.round(tiempoPromedio)} días`;
    } else {
      data = "N/A";
    }
  } else if (type === "comercial") {
    const bestSeller = await prisma.player.findFirst({
      where: {           
        role: { 
          equals: "ANALISTA_COMERCIAL" 
        }
      },
      orderBy: {
        leads: { // Asegúrate de que `leads` está bien definido en Prisma
          _count: "desc",
        },
      },
      select: {
        name: true,
        _count: {
          select: { leads: true }, // Contamos los `leads`
        },
      },
    });
    
    data = bestSeller ? `${bestSeller.name} - ${bestSeller._count.leads}` : "No disponible";
    
  } else {
    data = await prisma.lead.count({
      where: {
        status: {
          notIn: ["CLOSED"],
        },
      },
    });
  }

  return (
    <div className="relative rounded-2xl odd:bg-lamaPurple even:bg-lamaSky p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">2024/25</span>
        <Image 
           src="/more.png" 
           alt="" width={20} 
           height={20} 
           className="cursor-pointer" 
        />
      </div>
      
      <h1 className="text-2xl font-semibold my-4 text-white">{data}</h1>
      <h2 className="capitalize text-sm font-medium text-white">{type}</h2>

      {/* Imagen en la esquina inferior derecha */}
      <Image 
        src="/help.jpg" 
        alt="Ayuda" 
        width={20} 
        height={20} 
        className="absolute bottom-2 right-2 cursor-pointer"
      />
    </div>
  );
};

export default CiclosCard;