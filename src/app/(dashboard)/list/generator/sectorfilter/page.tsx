"use client";

import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import TableSectorGenerator from "@/components/Tables/TableSectorGenerator";
import { AnimatePresence, motion } from "framer-motion";
import { DownloadCloudIcon } from "lucide-react";
import { toast } from "react-toastify";


const sectors = [
  { value: "AGRICULTURE_AND_FARMING", label: "Agriculture & Farming" },
  { value: "CONSTRUCTION_AND_INFRASTRUCTURE", label: "Construction & Infrastructure" },
  { value: "CONSUMER_AND_RETAIL", label: "Consumer & Retail" },
  { value: "DEFENSE_AND_SECURITY", label: "Defense & Security" },
  { value: "DESIGN_AND_CREATIVE", label: "Design & Creative" },
  { value: "EDUCATION", label: "Education" },
  { value: "ENERGY_AND_ENVIRONMENT", label: "Energy & Environment" },
  { value: "EVENTS_AND_HOSPITALITY", label: "Events & Hospitality" },
  { value: "FINANCE_AND_INSURANCE", label: "Finance & Insurance" },
  { value: "HEALTH_AND_WELLNESS", label: "Health & Wellness" },
  { value: "INDUSTRY_AND_MANUFACTURING", label: "Industry & Manufacturing" },
  { value: "INFORMATION_TECHNOLOGY_AND_SERVICES", label: "IT & Services" },
  { value: "LOGISTICS_AND_TRANSPORTATION", label: "Logistics & Transportation" },
  { value: "MEDIA_AND_ENTERTAINMENT", label: "Media & Entertainment" },
  { value: "NON_PROFITS_AND_PHILANTHROPY", label: "Non-Profits & Philanthropy" },
  { value: "OTHER_MATERIALS_AND_PRODUCTION", label: "Other Materials & Production" },
  { value: "PHARMACEUTICALS", label: "Pharmaceuticals" },
  { value: "PROFESSIONAL_SERVICES_AND_CONSULTING", label: "Professional Services & Consulting" },
  { value: "PUBLIC_SECTOR_AND_GOVERNMENT", label: "Public Sector & Government" },
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "TECHNOLOGY_AND_TELECOMMUNICATIONS", label: "Technology & Telecommunications" },
];


interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone1?: string;
  phone2?: string;
  jobTitle: string;
}

interface CompanyWithContacts {
  name: string;
  sector: string;
  contacts: Contact[];
}

const FormSectorList = () => {
  const [sector, setSector] = useState<string>("");
  const [showTable, setShowTable] = useState<boolean>(false);
  const [recordCount, setRecordCount] = useState<number>(0);
  const [companiesData, setCompaniesData] = useState<CompanyWithContacts[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sector) {
      setShowTable(true);
    }
  };

  const handleReset = () => {
    setSector("");
    setShowTable(false);
  };

  const handleDownload = async () => {
  try {
    const res = await fetch("/api/export/list/excel", {
      method: "POST",
      body: JSON.stringify({ companies: companiesData }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Error en la descarga");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prospection_list.xlsx";
    a.click();
    a.remove();

    toast.success("Download completed successfully!");
  } catch (error) {
    toast.error("Error downloading file.");
  }
};

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">List Generator - Sector</h1>
          <p className="text-gray-500">Generate and download customized prospection lists</p>
        </div>
        
        <Button asChild variant="outline">
          <Link href="/list/generator">Back to generator panel</Link>
        </Button>
      </div>

      <form
        className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md space-y-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor="sector-select"
            className="block mb-2 text-sm font-semibold text-gray-700"
          >
            Select Company Sector
          </label>
          
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger
              id="sector-select"
              aria-label="Select Company Sector"
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <SelectValue placeholder="Choose a sector" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
              {sectors.map(({ value, label }) => (
                <SelectItem
                  key={value}
                  value={value}
                  className="cursor-pointer px-4 py-2 hover:bg-blue-50 focus:bg-blue-100 text-gray-900"
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!sector}
            className={`w-full rounded-md px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500
              ${sector
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
          >
            Filter
          </button>

          <button
            type="button"
            disabled={!sector}
            onClick={handleReset}           
            className={`w-full rounded-md px-4 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500
              ${sector
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
          >
            Reset
          </button>
        </div>
      </form>

      <AnimatePresence>
        {showTable && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            className="bg-white"
          >
            <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-300 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">List</h2>
               <span className="text-sm text-gray-600">
                {recordCount} {recordCount === 1 ? "record" : "records"} found
              </span>
              <Button
              onClick={handleDownload}
              className="ml-2 flex items-center gap-2 bg-black text-white hover:bg-blue-600 transition-colors"
            >
              <DownloadCloudIcon className="w-5 h-5 text-white" />
              Download
            </Button>
            </div>
            <div className="bg-white p-4 rounded-b-lg">
              <TableSectorGenerator
                sector={sector}
                onCountUpdate={setRecordCount}
                onDataLoad={setCompaniesData}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormSectorList;