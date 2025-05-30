"use client"

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const LeadAtRiskFilter = ({ totalCount }: { totalCount: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState(searchParams.get("name") || "");
  const [company, setCompany] = useState(searchParams.get("company") || "");
  const [sector, setSector] = useState(searchParams.get("sector") || "");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [risk, setRisk] = useState(searchParams.get("risk") || "");

  const [hasFiltered, setHasFiltered] = useState(false);

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams);

    name ? params.set("name", name) : params.delete("name");
    company ? params.set("company", company) : params.delete("company");
    sector ? params.set("sector", sector) : params.delete("sector");
    startDate ? params.set("startDate", startDate) : params.delete("startDate");
    endDate ? params.set("endDate", endDate) : params.delete("endDate");
    risk ? params.set("risk", risk) : params.delete("risk");

    params.delete("page");
    setHasFiltered(true);
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    setName("");
    setCompany("");
    setSector("");
    setStartDate("");
    setEndDate("");
    setRisk("");
    setHasFiltered(false);
    router.push("/list/track");
  };

  const handleDownload = async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const response = await fetch(`/api/export/atrisk?${params.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al generar el archivo CSV");
    }

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "leads-at-risk.csv";
    link.click();

    toast.success("File downloaded successfully");
  } catch (error) {
    console.error(error);
    toast.error("Error downloading file.");
  }
};

  return (
    <div className="mb-4 bg-black rounded-lg px-6 py-4 flex items-center justify-start gap-6 flex-wrap">
      {/* Name */}
      <div className="flex flex-col">
        <label className="text-sm text-white font-semibold mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-48"
          placeholder="Lead name"
        />
      </div>

      {/* Company */}
      <div className="flex flex-col">
        <label className="text-sm text-white font-semibold mb-1">Company</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border p-2 rounded w-48"
          placeholder="Company name"
        />
      </div>

      {/* Sector */}
      <div className="flex flex-col">
        <label className="text-sm text-white font-semibold mb-1">Sector</label>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="border p-2 rounded w-48"
        >
          {sectorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="flex flex-col">
        <label className="text-sm text-white font-semibold mb-1">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded w-48"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-white font-semibold mb-1">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded w-48"
        />
      </div>

      {/* Risk */}
      <div className="flex flex-col">
        <label className="text-sm text-white font-semibold mb-1">Risk</label>
        <select
          value={risk}
          onChange={(e) => setRisk(e.target.value)}
          className="border p-2 rounded w-48"
        >
          <option value="">All</option>
          {["Low Risk", "Medium Risk", "High Risk"].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons */}
      <div className="flex flex-row justify-center items-center gap-2 mt-6">
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Filter
        </button>
        <button
          onClick={handleReset}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Reset
        </button>
      </div>

      {hasFiltered && totalCount >= 0 && (
        <div className="flex items-center gap-4 mt-6">
          <span className="text-sm text-white">
            {totalCount} leads{totalCount === 1 ? "" : "s"} found
          </span>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 transition"
          >
            <HiDownload size={18} />
            <span>Download</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LeadAtRiskFilter;
