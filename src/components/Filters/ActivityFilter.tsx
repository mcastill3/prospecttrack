"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { HiDownload } from "react-icons/hi";
import { toast } from "react-toastify";

// Types
type AreaOption = {
  id: string;
  name: string;
};

const ACTIVITY_TYPES = [
  "WEBINAR", "TRADESHOW", "PHYSICAL_EVENT", "LINKEDIN_CAMPAIGN", "GOOGLE_CAMPAIGN",
  "PAID_MEDIA_BRANDED_CONTENT", "WEBSITE_FORM", "WEBSITE_REFERRAL", "WEBINAR_WITH_VENDOR",
  "TRADESHOW_WITH_VENDOR", "PHYSICAL_EVENT_WITH_VENDOR", "VENDOR_REFERRAL", "BDR", "DIGITAL_SALES"
];

const EXECUTION_STATUSES = ["TO_BE_QUALIFIED", "INTERESTED", "INTERESTED_IN_OTHER_SOLUTIONS",
  "NOT_INTERESTED", "RESEND_INFORMATION", "NO_CURRENT_NEED_CONTACT_IN_THE_FUTURE",
  "MEETING_CLOSED", "INFORMATION_REQUEST"];

const ActivityFilter = ({
  areas,
  totalCount,
}: {
  areas: AreaOption[];
  totalCount: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState(searchParams.get("type") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [areaId, setAreaId] = useState(searchParams.get("areaId") || "");
  const [startDate, setStartDate] = useState(searchParams.get("startDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  const [hasFiltered, setHasFiltered] = useState(false);

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams);

    type ? params.set("type", type) : params.delete("type");
    status ? params.set("status", status) : params.delete("status");
    areaId ? params.set("areaId", areaId) : params.delete("areaId");
    startDate ? params.set("startDate", startDate) : params.delete("startDate");
    endDate ? params.set("endDate", endDate) : params.delete("endDate");

    params.delete("page");
    setHasFiltered(true);
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    setType("");
    setStatus("");
    setAreaId("");
    setStartDate("");
    setEndDate("");
    setHasFiltered(false);
    router.push("?");
  };

  const handleDownload = async () => {
  try {
    const params = new URLSearchParams(window.location.search);

    const response = await fetch(`/api/export/activities?${params.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al generar el archivo CSV");
    }

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "activities.csv";
    link.click();

    toast.success("File downloaded successfully");
  } catch (error) {
    console.error(error);
    toast.error("Error downloading file.");
  }
};

  return (
    <div className="mb-4 bg-black rounded-lg px-6 py-4 flex items-center justify-start gap-6 flex-wrap">
      {/* Type */}
      <div className="flex flex-col">
        <label className="text-sm text-white font-semibold mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded w-48"
        >
          <option value="">All</option>
          {ACTIVITY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.replace(/_/g, " ")}
            </option>
          ))}
        </select>
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
          {EXECUTION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Area */}
      <div className="flex flex-col">
        <label className="text-sm text-white font-semibold mb-1">Area</label>
        <select
          value={areaId}
          onChange={(e) => setAreaId(e.target.value)}
          className="border p-2 rounded w-48"
        >
          <option value="">All</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range */}
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
            {totalCount} activities{totalCount === 1 ? "y" : "ies"} found
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

export default ActivityFilter;