import { PrismaClient } from "@prisma/client";
import Image from "next/image";

const countryCodeMap: Record<string, string> = {
    Spain: "ES", France: "FR", Germany: "DE", Italy: "IT",
    "United States": "US", "United Kingdom": "GB", Canada: "CA",
    Mexico: "MX", Brazil: "BR", Argentina: "AR", Australia: "AU",
    Japan: "JP", China: "CN", India: "IN", Netherlands: "NL", Sweden: "SE",
    USA: "US",
  };
  
  const getFlagImageUrl = (country: string) => {
    const code = countryCodeMap[country];
    return code
      ? `https://flagcdn.com/w40/${code.toLowerCase()}.png`
      : "https://via.placeholder.com/40x30";
  };
  
  

const prisma = new PrismaClient();

const TablePerformance = async () => {
  // Obtener los jugadores de la base de datos
  const players = await prisma.player.findMany({
    include: {
      country: true, // Obtener información del país
      city: true, // Obtener información de la ciudad
      leads: true,
    },
  });

  return (
    <div className="bg-white p-4 rounded-md shadow-md">
      <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold text-gray-700">
          🔥 Comercial Performance
        </h2>
        <span className="text-sm text-gray-500 cursor-pointer">View All</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-black text-white">
            <tr>
              <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">Nombre</th>
              <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">Apellido</th>             
              <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">País</th>              
              <th className="py-4 px-6 text-left font-semibold uppercase tracking-wider">Leads</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {players
              .filter((player) => player.role === "ANALISTA_COMERCIAL")
              .map((player) => (
              <tr key={player.id} className="hover:bg-gray-50">
                <td className="py-3 px-6">{player.name}</td>
                <td className="py-3 px-6">{player.surname}</td>
                <td className="py-3 px-6 flex items-center space-x-2">
                <Image
                  src={getFlagImageUrl(player.country.name)}
                  alt={player.country.name}
                  width={30}
                  height={20}
                />
                <span className="ml-0">{player.country?.name || "N/A"}</span>
                </td>
                
                
                <td className="py-3 px-6 font-bold text-justify">{player.leads.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablePerformance;