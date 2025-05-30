"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Checkbox } from '../ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Contact } from '@prisma/client'
import TableCustomGenerator from '../Tables/TableCustomGenerator'
import { AnimatePresence, motion } from 'framer-motion'
import { DownloadCloudIcon } from 'lucide-react'
import Pagination from '../Pagination'
import { useRouter, useSearchParams } from 'next/navigation'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { toast } from "react-toastify";



type Fields = "COUNTRY" | "CITY" | "BUSINESS SIZE" | "SECTOR" | "JOB TITLE";

type JobTitle =
  | "CEO" | "CIO" | "CFO" | "CTO" | "CISO" | "COO"
  | "ARCHITECT" | "STO" | "IT_MANAGEMENT"
  | "INFORMATION_SECURITY" | "INFRAESTRUCTURE" | "OTHER";  

const SEARCH_FIELDS: { value: Fields; label: string }[] = [
  { value: "COUNTRY", label: "COUNTRY" },
  { value: "CITY", label: "CITY" },
  { value: "BUSINESS SIZE", label: "BUSINESS SIZE" },
  { value: "SECTOR", label: "SECTOR" },
  { value: "JOB TITLE", label: "JOB TITLE" },
];

const JOB_TITLES: { value: JobTitle; label: string }[] = [
  { value: "CEO", label: "CEO" },
  { value: "CIO", label: "CIO" },
  { value: "CFO", label: "CFO" },
  { value: "CTO", label: "CTO" },
  { value: "CISO", label: "CISO" },
  { value: "COO", label: "COO" },
  { value: "ARCHITECT", label: "ARCHITECT" },
  { value: "STO", label: "STO" },
  { value: "IT_MANAGEMENT", label: "IT MANAGEMENT" },
  { value: "INFORMATION_SECURITY", label: "INFORMATION SECURITY" },
  { value: "INFRAESTRUCTURE", label: "INFRAESTRUCTURE" },
  { value: "OTHER", label: "OTHER" },
];

const FormCustomFilter = () => {
  const [selectedFields, setSelectedFields] = useState<Fields[]>([]);
  const [selectedJobTitles, setSelectedJobTitles] = useState<JobTitle[]>([]);
  const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const isSelected = (field: Fields) => selectedFields.includes(field);
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);  
  const [filters, setFilters] = useState<any>({});
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [recordCount, setRecordCount] = useState<number>(0);
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") || 1);
  
  // Estado para cada filtro
  const [countryId, setCountryId] = useState<string>("");
  const [cityId, setCityId] = useState<string>("");
  const [businessSize, setBusinessSize] = useState<string>("");
  const [sector, setSector] = useState<string>("");
  const [filterApplied, setFilterApplied] = useState(false);

//Carga paises en el select
  useEffect(() => {
  const fetchCountries = async () => {
    try {
      const res = await fetch("/api/generator/custom");
      const data = await res.json();
      setCountries(data);
      setContacts(data.items);      // items debe venir del backend
      setRecordCount(data.total);
    } catch (err) {
      console.error("Error fetching countries", err);
    }
  };

  fetchCountries();
}, []);

//Carga ciudades en el select
useEffect(() => {
  if (!countryId) return;

  const fetchCities = async () => {
    try {
      const res = await fetch(`/api/generator/custom?countryId=${countryId}`);
      const data = await res.json();
      setCities(data);
    } catch (err) {
      console.error("Error fetching cities", err);
    }
  };

  fetchCities();
}, [countryId]);

//Carga JobTitles y CompanySector en los select
useEffect(() => {
  const fetchEnums = async () => {
    try {
      const res = await fetch("/api/generator/custom/enums");
      const data = await res.json();
      setJobTitles(data.jobTitles);
      setSectors(data.sectors);
    } catch (error) {
      console.error("Error fetching enums", error);
    }
  };
  fetchEnums();
}, []);



const handleSubmit = async (e: React.FormEvent) => {
  if (e.preventDefault) e.preventDefault();
  setFilterApplied(true);
  setLoading(true);

  // Construir params desde estados actuales
  const params = new URLSearchParams();

  // Siempre reset page a 1 si es submit directo
  params.set("page", "1");

  if (countryId) params.set("countryId", countryId);
  if (cityId) params.set("cityId", cityId);
  if (sector) params.set("sector", sector);
  if (businessSize) params.set("businessSize", businessSize);
  selectedJobTitles.forEach(jt => params.append("jobTitle", jt));

  // Actualizar URL para sincronizar estado con URL (Esto hace que 'page' en URL sea 1)
  router.push(`${window.location.pathname}?${params.toString()}`);
  setLoading(false);  
};
const isFilterReady =
  (isSelected("COUNTRY") && countryId) ||
  (isSelected("CITY") && cityId) ||
  (isSelected("SECTOR") && sector) ||
  (isSelected("BUSINESS SIZE") && businessSize) ||
  (isSelected("JOB TITLE") && selectedJobTitles.length > 0);

useEffect(() => {
  const fetchContacts = async () => {
    if (!isFilterReady) return;

    setLoading(true);
    const params = new URLSearchParams();

    if (countryId) params.set("countryId", countryId);
    if (cityId) params.set("cityId", cityId);
    if (sector) params.set("sector", sector);
    if (businessSize) params.set("businessSize", businessSize);
    selectedJobTitles.forEach(jt => params.append("jobTitle", jt));

    params.set("page", page.toString());
    params.set("pageSize", ITEM_PER_PAGE.toString());

    const res = await fetch(`/api/contacts/filter?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setContacts(data.items ?? data);
      setRecordCount(data.total ?? data.length ?? 0);
    } else {
      setContacts([]);
      setRecordCount(0);
    }

    setLoading(false);
  };

  fetchContacts();
}, [page, countryId, cityId, sector, businessSize, selectedJobTitles]);


  

const fetchContactsWithFilters = async (pageNumber: number) => {
  setLoading(true);

  const params = new URLSearchParams(window.location.search);

  // Asegura que la página esté actualizada en la URL
  params.set("page", pageNumber.toString());
  router.push(`${window.location.pathname}?${params.toString()}`);

  // Ahora usa los filtros directamente desde la URL
  const countryId = params.get("countryId") || undefined;
  const cityId = params.get("cityId") || undefined;
  const sector = params.get("sector") || undefined;
  const businessSize = params.get("businessSize") || undefined;
  const selectedJobTitles = params.getAll("jobTitle");

  const queryParams = new URLSearchParams();
  queryParams.set("page", pageNumber.toString());
  if (countryId) queryParams.set("countryId", countryId);
  if (cityId) queryParams.set("cityId", cityId);
  if (sector) queryParams.set("sector", sector);
  if (businessSize) queryParams.set("businessSize", businessSize);
  selectedJobTitles.forEach(jt => queryParams.append("jobTitle", jt));

  const res = await fetch(`/api/export/list/custom?${queryParams.toString()}`);
  if (res.ok) {
    const data = await res.json();
    setContacts(data.items ?? data);
    setRecordCount(data.total ?? data.length ?? 0);
  } else {
    setContacts([]);
    setRecordCount(0);
  }

  setLoading(false);
  
};


useEffect(() => {
  if (!filterApplied) return;
  if (!isFilterReady) return;
  fetchContactsWithFilters(page);
}, [page, isFilterReady, filterApplied]);


const handleDownload = async () => {
  if (!countryId && !cityId && !sector && !businessSize && selectedJobTitles.length === 0) return;

  try {
    const params = new URLSearchParams();
    if (countryId) params.append("countryId", countryId);
    if (cityId) params.append("cityId", cityId);
    if (sector) params.append("sector", sector);
    if (businessSize) params.append("businessSize", businessSize);
    selectedJobTitles.forEach((jt) => params.append("jobTitle", jt));
    params.append("page", "1");
    params.append("pageSize", "100000");

    const resAll = await fetch(`/api/export/list/custom?${params.toString()}`);
    const data = await resAll.json();

    if (!resAll.ok) {
      console.error("Error fetching all contacts:", data.error);
      toast.error("Error al obtener los contactos.");
      return;
    }

    const excelRes = await fetch("/api/export/list/excel/custom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contacts: data.items }),
    });

    if (!excelRes.ok) {
      console.error("Error generating Excel:", await excelRes.text());
      toast.error("Error al generar el archivo Excel.");
      return;
    }

    const blob = await excelRes.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prospection_list_by_country_city.xlsx";
    a.click();
    a.remove();

    // ✅ Toast de éxito
    toast.success("File downloaded successfully");

  } catch (err) {
    console.error("Error during download:", err);
    toast.error("There was a problem generating the file.");
  }
};



return (
  <div className="p-6 space-y-8">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold">List Generator - Job Title</h1>
        <p className="text-gray-500">Select filters to configure the form</p>
      </div>
      <Button asChild variant="outline">
        <Link href="/list/generator">Back to generator panel</Link>
      </Button>
    </div>

    {/* Contenedor para los dos formularios */}
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
      {/* Step 1: Selector de campos */}
      <div className="bg-white p-4 rounded-md shadow-sm border md:w-1/3">
        <h2 className="text-lg font-semibold mb-4">Select Filters</h2>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
          {SEARCH_FIELDS.map(({ value, label }) => {
            if (value === "CITY" && !selectedFields.includes("COUNTRY")) {
              return null;
            }
            return (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={value}
                  checked={selectedFields.includes(value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedFields([...selectedFields, value]);
                    } else {
                      setSelectedFields(selectedFields.filter((f) => f !== value));
                    }
                  }}
                />
                <label htmlFor={value}>{label}</label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Inputs Condicionales */}
      {selectedFields.length > 0 && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-md shadow-md md:w-2/3 space-y-6"
        >
          {/* Aquí va el formulario con los selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ... tus inputs condicionales aquí */}
            {isSelected("COUNTRY") && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Select Country</label>
                <Select value={countryId} onValueChange={setCountryId}>
                  <SelectTrigger className="w-full h-10 rounded-md border px-3 text-sm">
                    <SelectValue placeholder="Choose a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.id} value={country.id}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {isSelected("CITY") && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Select City</label>
                <Select value={cityId} onValueChange={setCityId}>
                  <SelectTrigger className="w-full h-10 rounded-md border px-3 text-sm">
                    <SelectValue placeholder="Choose a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city.id} value={city.id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* Resto de inputs igual */}
            {isSelected("SECTOR") && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Select Sector</label>
                <Select onValueChange={setSector}>
                  <SelectTrigger className="w-full h-10 rounded-md border px-3 text-sm">
                    <SelectValue placeholder="Choose a sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {isSelected("BUSINESS SIZE") && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Business Size</label>
                <Select onValueChange={setBusinessSize}>
                  <SelectTrigger className="w-full h-10 rounded-md border px-3 text-sm">
                    <SelectValue placeholder="Enterprise or SMB" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="smb">SMB</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {isSelected("JOB TITLE") && (
            <div>
              <label className="block text-sm font-semibold mb-2">Select Job Titles</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {jobTitles.map((jt) => (
                  <div key={jt} className="flex items-center space-x-2">
                    <Checkbox
                      id={jt}
                      checked={selectedJobTitles.includes(jt as JobTitle)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedJobTitles([...selectedJobTitles, jt as JobTitle]);
                        } else {
                          setSelectedJobTitles(selectedJobTitles.filter((item) => item !== jt));
                        }
                      }}
                    />
                    <label htmlFor={jt}>{jt.replace(/_/g, " ")}</label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button type="submit" className="w-full" disabled={!isFilterReady || loading}>
              {loading ? "Loading..." : "Filter"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setSelectedFields([]);
                setSelectedJobTitles([]);
                setCountryId("");
                setCityId("");
                setBusinessSize("");
                setSector("");
                setSelectedCountry(null);
                setCities([]);
                setContacts([]); // Oculta tabla
              }}
            >
              Reset
            </Button>
          </div>
        </form>
        
      )}
    </div>
     
    {/* Tabla abajo */}
   <AnimatePresence>
  {Array.isArray(contacts) && contacts.length > 0 && (
    <motion.div
      key="contacts-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow rounded-lg"
    >
      <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Contactos</h2>
        <span className="text-sm text-gray-600">
          {recordCount} records found
        </span>
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <DownloadCloudIcon className="w-5 h-5" />
          Descargar
        </Button>
      </div>
      <div className="p-4">
        <TableCustomGenerator contacts={contacts} />
        <Pagination page={page} count={recordCount} />
      </div>
    </motion.div>
  )}
</AnimatePresence>
  </div>
);

}

export default FormCustomFilter