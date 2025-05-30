import React, { useEffect, useState } from "react";

export default function FilterWithCheckboxes() {
  // Estados de habilitación para filtros
  const [enableCountry, setEnableCountry] = useState(false);
  const [enableCity, setEnableCity] = useState(false);
  const [enableType, setEnableType] = useState(false);

  // Datos y selección
  const [countries, setCountries] = useState<{ id: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [countryId, setCountryId] = useState("");
  const [cityId, setCityId] = useState("");
  const [type, setType] = useState("");

  // Cargar países al inicio
  useEffect(() => {
    fetch("/api/generator/countries")
      .then((res) => res.json())
      .then(setCountries);
  }, []);

  // Cargar ciudades solo si habilitado y country seleccionado
  useEffect(() => {
    if (enableCity && countryId) {
      fetch(`/api/generator/cities?countryId=${countryId}`)
        .then((res) => res.json())
        .then(setCities);
    } else {
      setCities([]);
      setCityId("");
    }
  }, [enableCity, countryId]);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Filters with Enable Switches</h1>

      {/* Checkbox Country */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={enableCountry}
          onChange={() => {
            setEnableCountry((v) => !v);
            // si deshabilitas country, reset city y type
            if (enableCountry) {
              setEnableCity(false);
              setCountryId("");
              setCityId("");
            }
          }}
        />
        <span>Enable Country</span>
      </label>
      {/* Select Country */}
      <select
        disabled={!enableCountry}
        value={countryId}
        onChange={(e) => setCountryId(e.target.value)}
        className={`w-full border rounded p-2 ${
          enableCountry ? "" : "opacity-50 cursor-not-allowed"
        }`}
      >
        <option value="">Select country</option>
        {countries.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Checkbox City */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={enableCity}
          onChange={() => {
            setEnableCity((v) => !v);
            if (enableCity) {
              setCityId("");
            }
          }}
          disabled={!enableCountry} // Solo si country está habilitado
        />
        <span className={enableCountry ? "" : "text-gray-400"}>
          Enable City (requires Country)
        </span>
      </label>
      {/* Select City */}
      <select
        disabled={!enableCity || !countryId}
        value={cityId}
        onChange={(e) => setCityId(e.target.value)}
        className={`w-full border rounded p-2 ${
          enableCity && countryId ? "" : "opacity-50 cursor-not-allowed"
        }`}
      >
        <option value="">Select city</option>
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Checkbox Type */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={enableType}
          onChange={() => {
            setEnableType((v) => !v);
            if (enableType) setType("");
          }}
        />
        <span>Enable Type</span>
      </label>
      {/* Select Type */}
      <select
        disabled={!enableType}
        value={type}
        onChange={(e) => setType(e.target.value)}
        className={`w-full border rounded p-2 ${
          enableType ? "" : "opacity-50 cursor-not-allowed"
        }`}
      >
        <option value="">Select type</option>
        <option value="Enterprise">Enterprise (≥ 500M)</option>
        <option value="SMB">SMB (&lt; 500M)</option>
      </select>
    </div>
  );
}
