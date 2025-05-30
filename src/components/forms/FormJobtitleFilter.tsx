"use client";

import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { DownloadCloudIcon } from "lucide-react";
import Pagination from "@/components/Pagination";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter, useSearchParams } from "next/navigation";
import TableJobtitleGenerator from "../Tables/TableJobtitleGenerator";
import { toast } from "react-toastify";

type JobTitle =
  | "CEO"
  | "CIO"
  | "CFO"
  | "CTO"
  | "CISO"
  | "COO"
  | "ARCHITECT"
  | "STO"
  | "IT_MANAGEMENT"
  | "INFORMATION_SECURITY"
  | "INFRAESTRUCTURE"
  | "OTHER";

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone1?: string;
  phone2?: string;
  jobTitle: JobTitle;
  company?: {
    name: string;
    sector?: string;
  } | null;
}

export const JOB_TITLES: { value: JobTitle; label: string }[] = [
  { value: "CEO", label: "CEO" },
  { value: "CIO", label: "CIO" },
  { value: "CFO", label: "CFO" },
  { value: "CTO", label: "CTO" },
  { value: "CISO", label: "CISO" },
  { value: "COO", label: "COO" },
  { value: "ARCHITECT", label: "ARCHITECT" },
  { value: "STO", label: "STO" },
  { value: "IT_MANAGEMENT", label: "II MANAGEMENT" },
  { value: "INFORMATION_SECURITY", label: "INFORMATION SECURITY" },
  { value: "INFRAESTRUCTURE", label: "INFRAESTRUCTURE" },
  { value: "OTHER", label: "OTHER" },
];


const FormJobtitleFilter: React.FC = () => {
  const [selectedJobTitles, setSelectedJobTitles] = useState<JobTitle[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [recordCount, setRecordCount] = useState<number>(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);

  const toggleJobTitle = (title: JobTitle) => {
    setSelectedJobTitles((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedJobTitles.length === 0) return;

    const params = new URLSearchParams(window.location.search);
    params.set("page", "1");
    router.push(`${window.location.pathname}?${params}`);

    setShowTable(true);
  };

  useEffect(() => {
    if (!showTable || selectedJobTitles.length === 0) return;

    const fetchContacts = async () => {
    const query = selectedJobTitles.map((t) => `jobTitle=${t}`).join("&"); // ✅ corregido
    const res = await fetch(`/api/export/list/jobtitle?${query}&page=${page}&pageSize=${ITEM_PER_PAGE}`);
    const data = await res.json();
    setContacts(data.items);
    setRecordCount(data.total);
  };

  fetchContacts();
}, [selectedJobTitles, page, showTable]);
  

  const handleReset = () => {
    setSelectedJobTitles([]);
    setShowTable(false);
    setContacts([]);
    setRecordCount(0);
  };

  const handleDownload = async () => {
  if (selectedJobTitles.length === 0) return;

  try {
    const query = selectedJobTitles.map((t) => `jobTitle=${t}`).join("&");
    const resAll = await fetch(`/api/export/list/jobtitle?${query}&page=1&pageSize=100000`);
    const data = await resAll.json();

    const excelRes = await fetch("/api/export/list/excel/jobtitle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacts: data.items }),
    });

    if (!excelRes.ok) throw new Error("Error al generar el archivo");

    const blob = await excelRes.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prospection_list_by_jobtitle.xlsx";
    a.click();
    a.remove();


    toast.success("File downloaded successfully");

  } catch (error) {
    toast.error("There was a problem generating the file.");
    console.error(error);
  }
};


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">List Generator - Job Title</h1>
          <p className="text-gray-500">Select job titles and generate the list</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/list/generator">Back to generator panel</Link>
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md max-w-2xl space-y-6 mx-auto"        
      >
        <div>
          <label className="block text-sm font-semibold mb-2">Select Job Titles</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {JOB_TITLES.map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={value}
                  checked={selectedJobTitles.includes(value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedJobTitles([...selectedJobTitles, value]);
                    } else {
                      setSelectedJobTitles(selectedJobTitles.filter((jt) => jt !== value));
                    }
                  }}
                />
                <label htmlFor={value}>{label}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={selectedJobTitles.length === 0}>
            Filter
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={selectedJobTitles.length === 0}
          >
            Reset
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {showTable && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="bg-white"
          >
            <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-700">List</h2>
              <span className="text-sm text-gray-600">{recordCount} records found</span>
              <Button onClick={handleDownload} className="flex items-center gap-2">
                <DownloadCloudIcon className="w-5 h-5" />
                Download
              </Button>
            </div>
            <div className="p-4">
              <TableJobtitleGenerator contacts={contacts} />
              <Pagination page={page} count={recordCount} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormJobtitleFilter;