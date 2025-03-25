import React from "react";

// Diccionario de países con códigos Alpha-2
const countryCodeMap: Record<string, string> = {
  Spain: "ES",
  France: "FR",
  Germany: "DE",
  Italy: "IT",
  "United States": "US",
  "United Kingdom": "GB",
  Canada: "CA",
  Mexico: "MX",
  Brazil: "BR",
  Argentina: "AR",
  Australia: "AU",
  Japan: "JP",
  China: "CN",
  India: "IN",
  Netherlands: "NL",
  Sweden: "SE",
  USA: "US",
  // Agrega más países según sea necesario
};

// Función para obtener la URL de la bandera
const getFlagImageUrl = (country: string) => {
  const code = countryCodeMap[country]; // Obtener código ISO Alpha-2
  return code
    ? `https://flagcdn.com/w40/${code.toLowerCase()}.png`
    : "https://via.placeholder.com/40x30"; // Placeholder si no hay bandera
};

interface Company {
  id: string;
  name: string;
  industry: string;
  size: number;
  country: string;
  city: string;
}

const CompanyChart = ({ companies }: { companies: Company[] }) => {
  return (
    <div className="bg-white rounded-xl w-full p-6">
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-[#f4f4f5] text-gray-700 text-sm uppercase font-semibold">
              <th className="px-6 py-3 text-left border-b">Name</th>
              <th className="px-6 py-3 text-left border-b">Industry</th>
              <th className="px-6 py-3 text-left border-b">Size</th>
              <th className="px-6 py-3 text-left border-b">Country</th>
              <th className="px-6 py-3 text-left border-b">City</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr
                key={company.id}
                className={`border-b text-gray-700 text-sm ${
                  index % 2 === 0 ? "bg-white" : "bg-[#f4f4f5]"
                }`}
              >
                <td className="px-6 py-3">{company.name}</td>
                <td className="px-6 py-3">{company.industry}</td>
                <td className="px-6 py-3">{company.size}</td>
                <td className="px-6 py-3 flex items-center gap-2">
                  <img
                    src={getFlagImageUrl(company.country)}
                    alt={company.country}
                    className="w-6 h-4 rounded-sm border border-gray-300"
                  />
                  {company.country}
                </td>
                <td className="px-6 py-3">{company.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyChart;