import prisma from "@/lib/prisma";
import SectorAccountChart from "../Charts/SectorAccountChart";


const formatSectorLabel = (raw: string) => {
  return raw
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const SectorAccountContainer = async () => {
  const companiesBySector = await prisma.company.groupBy({
    by: ["sector"], // Agrupamos por el campo 'sector'
    _count: {
      id: true, // Contamos cuántas empresas hay en cada sector
    },
    orderBy: {
      _count: {
        id: "desc", // Ordenamos por el número de empresas en orden descendente
      },
    },
  });

  // Formateamos los datos obtenidos para la visualización
  const formattedData = companiesBySector.map((item) => ({
    id: item.sector || "Unknown", // Si el sector es null, lo mostramos como "Unknown"
    label: formatSectorLabel(item.sector || "Unknown"), // Formateamos el nombre del sector
    value: item._count.id, // Usamos el conteo de empresas por sector
  }));

  console.log(formattedData); // Puedes hacer un log para revisar el resultado

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full h-[600px]">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h1 className="text-xl font-semibold text-gray-700">
          Company Distribution by Sector
        </h1>
      </div>
      <SectorAccountChart data={formattedData} />
    </div>
  );
};

export default SectorAccountContainer;