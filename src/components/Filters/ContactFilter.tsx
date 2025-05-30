"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { HiDownload } from "react-icons/hi";
import { toast } from "react-toastify";


type Option = {
  id: string;
  name: string;
};

type CountryOption = {
  id: string;
  name: string;
};

type CityOption = {
  id: string;
  name: string;
  countryId: string;
};

const JOB_TITLES = [
  "CEO", "CIO", "CFO", "CTO", "CISO", "COO", "ARCHITECT",
  "STO", "IT_MANAGEMENT", "INFORMATION_SECURITY", "INFRAESTRUCTURE", "OTHER"
];

const ContactFilter = ({
  countries,
  cities,
  totalCount,
}: {
  countries: CountryOption[];
  cities: CityOption[];
  totalCount: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [firstName, setFirstName] = useState(searchParams.get("firstName") || "");
  const [lastName, setLastName] = useState(searchParams.get("lastName") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [jobTitle, setJobTitle] = useState(searchParams.get("jobTitle") || "");
  const [countryId, setCountryId] = useState(searchParams.get("countryId") || "");
  const [cityId, setCityId] = useState(searchParams.get("cityId") || "");

  const [filteredCities, setFilteredCities] = useState<Option[]>(cities);

  const [hasFiltered, setHasFiltered] = useState(false);


  useEffect(() => {
    if (!countryId) {
      setFilteredCities(cities);
    } else {
      const matchingCities = cities.filter((city) => city.countryId === countryId);
      setFilteredCities(matchingCities);

      if (!matchingCities.find((c) => c.id === cityId)) {
        setCityId("");
      }
    }
  }, [countryId, cities]);

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams);

    firstName ? params.set("firstName", firstName) : params.delete("firstName");
    lastName ? params.set("lastName", lastName) : params.delete("lastName");
    email ? params.set("email", email) : params.delete("email");
    jobTitle ? params.set("jobTitle", jobTitle) : params.delete("jobTitle");
    countryId ? params.set("countryId", countryId) : params.delete("countryId");
    cityId ? params.set("cityId", cityId) : params.delete("cityId");

    params.delete("page");
    setHasFiltered(true);
    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
  setFirstName("");
  setLastName("");
  setEmail("");
  setJobTitle("");
  setCountryId("");
  setCityId("");
  setHasFiltered(false); 
  router.push("?");
};

const handleDownload = async () => {
  const params = new URLSearchParams(window.location.search);

  try {
    const response = await fetch(`/api/export/contact?${params.toString()}`, {
      method: "GET",
    });

    if (response.ok) {
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "contacts.csv";
      link.click();

      toast.success("Archivo descargado correctamente.");
    } else {
      toast.error("Error al generar el archivo CSV.");
    }
  } catch (error) {
    console.error("Error de red o del servidor:", error);
    toast.error("Ocurrió un error al intentar descargar el archivo.");
  }
};

  return (
    <div className="mb-4 bg-black rounded-lg h-[140px] px-6 flex items-center justify-start gap-6 flex-wrap">
  {/* Last Name */}
  <div className="flex flex-col justify-center items-start">
    <label className="text-sm text-white font-semibold mb-1">Last Name</label>
    <input
      type="text"
      value={lastName}
      onChange={(e) => setLastName(e.target.value)}
      className="border p-2 rounded w-48"
      placeholder="Search"
    />
  </div>

  {/* Email */}
  <div className="flex flex-col justify-center items-start">
    <label className="text-sm text-white font-semibold mb-1">Email</label>
    <input
      type="text"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="border p-2 rounded w-48"
      placeholder="Search"
    />
  </div>

  {/* Job Title */}
  <div className="flex flex-col justify-center items-start">
    <label className="text-sm text-white font-semibold mb-1">Job Title</label>
    <select
      value={jobTitle}
      onChange={(e) => setJobTitle(e.target.value)}
      className="border p-2 rounded w-48"
    >
      <option value="">All</option>
      {JOB_TITLES.map((title) => (
        <option key={title} value={title}>
          {title.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  </div>

  {/* Country */}
  <div className="flex flex-col justify-center items-start">
    <label className="text-sm text-white font-semibold mb-1">Country</label>
    <select
      value={countryId}
      onChange={(e) => setCountryId(e.target.value)}
      className="border p-2 rounded w-48"
    >
      <option value="">All</option>
      {countries.map((country) => (
        <option key={country.id} value={country.id}>
          {country.name}
        </option>
      ))}
    </select>
  </div>

  {/* City */}
  <div className="flex flex-col justify-center items-start">
    <label className="text-sm text-white font-semibold mb-1">City</label>
    <select
      value={cityId}
      onChange={(e) => setCityId(e.target.value)}
      className="border p-2 rounded w-48"
    >
      <option value="">All</option>
      {filteredCities.map((city) => (
        <option key={city.id} value={city.id}>
          {city.name}
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
            {totalCount} contact{totalCount === 0 ? "" : "s"} found
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

export default ContactFilter;