"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { HiDownload } from "react-icons/hi";
import { toast } from "react-toastify";

const sectorOptions = [
  { value: "", label: "All Sectors" },
  { value: "AGRICULTURE_AND_FARMING", label: "Agriculture and Farming" },
  { value: "CONSTRUCTION_AND_INFRASTRUCTURE", label: "Construction and Infrastructure" },
  { value: "CONSUMER_AND_RETAIL", label: "Consumer and Retail" },
  { value: "DEFENSE_AND_SECURITY", label: "Defense and Security" },
  { value: "DESIGN_AND_CREATIVE", label: "Design and Creative" },
  { value: "EDUCATION", label: "Education" },
  { value: "ENERGY_AND_ENVIRONMENT", label: "Energy and Environment" },
  { value: "EVENTS_AND_HOSPITALITY", label: "Events and Hospitality" },
  { value: "FINANCE_AND_INSURANCE", label: "Finance and Insurance" },
  { value: "HEALTH_AND_WELLNESS", label: "Health and Wellness" },
  { value: "INDUSTRY_AND_MANUFACTURING", label: "Industry and Manufacturing" },
  { value: "INFORMATION_TECHNOLOGY_AND_SERVICES", label: "IT and Services" },
  { value: "LOGISTICS_AND_TRANSPORTATION", label: "Logistics and Transportation" },
  { value: "MEDIA_AND_ENTERTAINMENT", label: "Media and Entertainment" },
  { value: "NON_PROFITS_AND_PHILANTHROPY", label: "Non-profits and Philanthropy" },
  { value: "OTHER_MATERIALS_AND_PRODUCTION", label: "Other Materials and Production" },
  { value: "PHARMACEUTICALS", label: "Pharmaceuticals" },
  { value: "PROFESSIONAL_SERVICES_AND_CONSULTING", label: "Professional Services and Consulting" },
  { value: "PUBLIC_SECTOR_AND_GOVERNMENT", label: "Public Sector and Government" },
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "TECHNOLOGY_AND_TELECOMMUNICATIONS", label: "Technology and Telecommunications" },
];

type CompanyFilterProps = {
  totalCount: number;
  hasFiltered: boolean;
};


const CompanyFilter = ({
  countries,
  cities,
  totalCount,
}: {
  countries: { id: string; name: string }[];
  cities: { id: string; name: string; countryId: string }[];
  totalCount: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState(searchParams.get("name") || "");
  const [sector, setSector] = useState(searchParams.get("sector") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [hasLeads, setHasLeads] = useState(searchParams.get("hasLeads") || "");
  const [countryId, setCountryId] = useState(searchParams.get("countryId") || "");
  const [cityId, setCityId] = useState(searchParams.get("cityId") || "");

  const [hasFiltered, setHasFiltered] = useState(false);


  useEffect(() => {
    setName(searchParams.get("name") || "");
    setSector(searchParams.get("sector") || "");
  }, [searchParams]);

  

  // 🔍 Aplicar filtros
  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    name ? params.set("name", name) : params.delete("name");
    sector ? params.set("sector", sector) : params.delete("sector");
    type ? params.set("type", type) : params.delete("type");
    hasLeads ? params.set("hasLeads", hasLeads) : params.delete("hasLeads");
    countryId ? params.set("countryId", countryId) : params.delete("countryId");
    cityId ? params.set("cityId", cityId) : params.delete("cityId");

    params.delete("page"); // Reset de paginación
    setHasFiltered(true);
    router.push(`?${params.toString()}`);
  };

  // 🔄 Resetear filtros
  const handleReset = () => {
    setName("");
    setSector("");
    setType("");
    setHasLeads("");
    setCountryId("");
    setCityId("");
    setHasFiltered(false); 

    router.push("?");
  };
  const handleDownload = async () => {
  try {
    const params = new URLSearchParams(window.location.search);

    const response = await fetch(`/api/export?${params.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al generar el archivo CSV");
    }

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "companies.csv";
    link.click();

    toast.success("File downloaded successfully");
  } catch (error) {
    console.error(error);
    toast.error("Error downloading file.");
  }
};

  return (
    <div className="mb-4 bg-black rounded-lg h-[140px] px-6 flex items-center justify-start gap-6 flex-wrap">
      <div className="flex flex-col md:flex-row gap-4">
        {/* 🔍 Nombre */}
        <div className="flex flex-col justify-center items-start">
          <label className="text-sm text-white font-semibold mb-1">Search by Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Microsoft"
            className="border p-2 rounded w-40"
          />
        </div>

        {/* 🏷️ Sector */}
        <div className="flex flex-col justify-center items-start">
          <label className="text-sm text-white font-semibold mb-1">Filter by Sector</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="border p-2 rounded w-40"
          >
            {sectorOptions.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>
      {/* 🏷️ Business Size */}
      <div className="flex flex-col justify-center items-start">
        <label htmlFor="type" className="text-sm text-white font-semibold mb-1">Type</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-40"
        >
          <option value="">All</option>
          <option value="Enterprise">Enterprise</option>
          <option value="SMB">SMB</option>
        </select>
      </div>
      {/* 🏷️ Leads */}
      <div className="flex flex-col justify-center items-start">
        <label htmlFor="hasLeads" className="text-sm text-white font-semibold mb-1">Has Leads</label>
        <select
          id="hasLeads"
          value={hasLeads}
          onChange={(e) => setHasLeads(e.target.value)}
          className="border p-2 rounded w-40"
        >
          <option value="">All</option>
          <option value="true">With Leads</option>
          <option value="false">Without Leads</option>
        </select>
      </div>
      {/* 🏷️ Country */}
      <div className="flex flex-col justify-center items-start">
        <label htmlFor="countryId" className="text-sm text-white font-semibold mb-1">Country</label>
        <select
          id="countryId"
          value={countryId}
          onChange={(e) => {
            setCountryId(e.target.value);
            setCityId(""); // resetear ciudad cuando cambia país
          }}
          className="border p-2 rounded w-40"
        >
          <option value="">All Countries</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>
      {/* 🏷️ City */}
      <div className="flex flex-col justify-center items-start">
        <label htmlFor="cityId" className="text-sm text-white font-semibold mb-1">City</label>
        <select
          id="cityId"
          value={cityId}
          onChange={(e) => setCityId(e.target.value)}
          className="border p-2 rounded w-40"
        >
          <option value="">All Cities</option>
          {cities
            .filter(city => !countryId || city.countryId === countryId)
            .map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
        </select>
      </div>
      {/* 🎯 Botones */}
      <div className="flex flex-col gap-2 mt-6">
        <button
          onClick={handleFilter}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded"
        >
          Filters
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-300 hover:bg-gray-400 text-sm font-medium py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>
      {hasFiltered && totalCount >= 0 && (
        <div className="flex items-center gap-4 mt-6">
          <span className="text-sm text-white">
            {totalCount} company{totalCount === 0 ? "" : "s"} found
          </span>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 w-18 transition"
          >
            <HiDownload size={18} />
            <span>Download</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyFilter;