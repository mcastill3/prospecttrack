"use client"

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiDownload } from "react-icons/hi";
import { toast } from "react-toastify";

const leadStatusOptions = ["NEW", "OPEN", "CONTACTED", "QUALIFIED", "CLOSED", "LOST"];
const activityTypes = ["WEBINAR", "TRADESHOW", "PHYSICAL_EVENT", "LINKEDIN_CAMPAIGN",
  "GOOGLE_CAMPAIGN", "PAID_MEDIA_BRANDED_CONTENT", "WEBSITE_FORM", "WEBSITE_REFERRAL",
 "WEBINAR_WITH_VENDOR", "TRADESHOW_WITH_VENDOR", "PHYSICAL_EVENT_WITH_VENDOR", "VENDOR_REFERRAL",
 "BDR", "DIGITAL_SALES"]; // Ajusta según tu modelo real

const LeadFilter = ({ totalCount = 0 }: { totalCount?: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState(searchParams.get("name") || "");
  const [accountManager, setAccountManager] = useState(searchParams.get("accountManager") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [source, setSource] = useState(searchParams.get("source") || "");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  const [hasFiltered, setHasFiltered] = useState(false);
  
  const handleFilter = () => {
  const params = new URLSearchParams(searchParams);

  name ? params.set("name", name) : params.delete("name");
  accountManager ? params.set("accountManager", accountManager) : params.delete("accountManager");
  status ? params.set("status", status) : params.delete("status");
  source ? params.set("source", source) : params.delete("source");
  startDate ? params.set("startDate", startDate) : params.delete("startDate");
  endDate ? params.set("endDate", endDate) : params.delete("endDate");

  params.delete("page"); // Reiniciar paginación
  setHasFiltered(true);
  router.push(`?${params.toString()}`);
};


  const handleReset = () => {
    setName("");
    setAccountManager("");
    setStatus("");
    setSource("");
    setStartDate("");
    setEndDate("");
    setHasFiltered(false);
    router.push("/list/lead");
  };

  const handleDownload = async () => {
  try {
    const params = new URLSearchParams(window.location.search);

    const response = await fetch(`/api/export/leads?${params.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al generar el archivo CSV");
    }

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "leads.csv";
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
          placeholder="Lead name"
          className="border p-2 rounded w-48"
        />
      </div>

      {/* Account Manager */}
      <div className="flex flex-col">
        <label className="text-sm text-white font-semibold mb-1">Account Manager</label>
        <input
          type="text"
          value={accountManager}
          onChange={(e) => setAccountManager(e.target.value)}
          className="border p-2 rounded w-48"
        />
      </div>

      {/* Status */}
      <div className="flex flex-col">
        <label className="text-sm text-white font-semibold mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded w-48"
        >
          <option value="">All</option>
          {leadStatusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Source */}
      <div className="flex flex-col">
        <label className="text-sm text-white font-semibold mb-1">Source</label>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="border p-2 rounded w-48"
        >
          <option value="">All</option>
          {activityTypes.map((t) => (
            <option key={t} value={t}>
              {t.replace(/_/g, " ")}
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

export default LeadFilter;