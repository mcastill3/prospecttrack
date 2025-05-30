"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { DownloadCloudIcon } from "lucide-react";
import TableCityGenerator from "@/components/Tables/TableCityGenerator";
import Pagination from "@/components/Pagination";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

interface City {
  id: string;
  name: string;
}

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone1?: string;
  phone2?: string;
  jobTitle: string;
  company?: {
    name: string;
    sector?: string;
  } | null;
}

const FormCityFilter = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [cityId, setCityId] = useState<string>("");
  const [showTable, setShowTable] = useState<boolean>(false);
  const [recordCount, setRecordCount] = useState<number>(0);
  const [contactsData, setContactsData] = useState<Contact[]>([]);
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const router = useRouter();

  useEffect(() => {
    const fetchCities = async () => {
      const res = await fetch("/api/generator/companies/cities");
      const data = await res.json();
      setCities(data);
    };

    fetchCities();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityId) {
      setShowTable(true);
      const params = new URLSearchParams(window.location.search);
      params.set("page", "1");
      router.push(`${window.location.pathname}?${params}`);
    }
  };

  useEffect(() => {
    if (!cityId || !showTable) return;

    const fetchCompanies = async () => {
      const res = await fetch(
        `/api/export/list/city?cityId=${cityId}&page=${page}&pageSize=${ITEM_PER_PAGE}`
      );
      const data = await res.json();
      setContactsData(data.items);
      setRecordCount(data.total);
    };

    fetchCompanies();
  }, [cityId, page, showTable]);

  const handleReset = () => {
    setCityId("");
    setShowTable(false);
    setContactsData([]);
    setRecordCount(0);
  };

  const handleDownload = async () => {
  if (!cityId) return;

  try {
    const resAll = await fetch(
      `/api/export/list/city?cityId=${cityId}&page=1&pageSize=100000`
    );
    const data = await resAll.json();

    if (!resAll.ok) {
      console.error("Error fetching all contacts:", data.error);
      toast.error("Error al obtener los contactos.");
      return;
    }

    const excelRes = await fetch("/api/export/list/excel/city", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contacts: data.items }),
    });

    if (!excelRes.ok) {
      console.error("Error generating Excel:", await excelRes.text());
      toast.error("Error downloading file.");
      return;
    }

    const blob = await excelRes.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prospection_list_by_city.xlsx";
    a.click();
    a.remove();

    
    toast.success("File downloaded successfully");

  } catch (err) {
    console.error("Error during download:", err);
    toast.error("There was a problem generating the file.");
  }
};


  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">List Generator - City</h1>
          <p className="text-gray-500">Filter companies by city and download the list</p>
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
          <label htmlFor="city-select" className="block mb-2 text-sm font-semibold text-gray-700">
            Select City
          </label>
          <Select value={cityId} onValueChange={setCityId}>
            <SelectTrigger
              id="city-select"
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-gray-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <SelectValue placeholder="Choose a city" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-auto rounded-md border bg-white shadow-lg">
              {cities.map(({ id, name }) => (
                <SelectItem key={id} value={id} className="px-4 py-2 text-gray-900">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!cityId}
            className={`w-full rounded-md px-4 py-2 font-semibold ${
              cityId
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Filter
          </button>
          <button
            type="button"
            disabled={!cityId}
            onClick={handleReset}
            className={`w-full rounded-md px-4 py-2 font-semibold ${
              cityId
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
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
            <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">List</h2>
              <span className="text-sm text-gray-600">
                {recordCount} {recordCount === 1 ? "record" : "records"} found
              </span>
              <Button
                onClick={handleDownload}
                className="ml-2 flex items-center gap-2 bg-black text-white hover:bg-blue-600"
              >
                <DownloadCloudIcon className="w-5 h-5" />
                Download
              </Button>
            </div>
            <div className="bg-white p-4 rounded-b-lg">
              <TableCityGenerator contacts={contactsData} />
              <Pagination page={page} count={recordCount} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormCityFilter;
