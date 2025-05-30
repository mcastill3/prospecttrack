"use client"

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UploadCloud } from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  email: z.string().email(),
  jobTitle: z.enum([
    "CEO",
    "CIO",
    "CFO",
    "CTO",
    "CISO",
    "COO",
    "ARCHITECT",
    "STO",
    "IT_MANAGEMENT",
    "INFORMATION_SECURITY",
    "INFRAESTRUCTURE",
    "OTHER",
  ]),
  type: z.enum(["PROSPECT", "CLIENT", "PARTNER"]),
});

const CheckFilePage: React.FC = () => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const [errors, setErrors] = useState<string[][]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData as any[]);
      validateData(jsonData as any[]);
    };
    reader.readAsBinaryString(file);
  };

  const validateData = (rows: any[]) => {
    const rowErrors: string[][] = [];
    let hasErrors = false;

    rows.forEach((row, i) => {
      const result = contactSchema.safeParse(row);
      if (!result.success) {
        hasErrors = true;
        const issues = result.error.errors.map(
          (e) => `${e.path.join(".")}: ${e.message}`
        );
        rowErrors[i] = issues;
      }
    });

    setErrors(rowErrors);

    if (hasErrors) {
      toast.error(`Se encontraron errores en ${rowErrors.filter(e => e).length} fila(s). Revisa los detalles abajo.`);
    } else {
      toast.success("Archivo validado correctamente sin errores!");
    }
  };

  const handleReset = () => {
    setExcelData([]);
    setErrors([]);
    toast.info("Formulario restablecido. Puedes subir otro archivo.");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2 mt-10">
          <h1 className="text-3xl font-bold">File normalizing - Upload</h1>
          <p className="text-gray-500">Review & Normalize inputs files</p>
        </div>
          <Button asChild variant={"outline"}>
              <Link href={"/list/processor"}>Back to generator</Link>
          </Button>
      </div>
      <div className="min-h-screen flex items-start justify-center pt-24">
        <ToastContainer position="bottom-right" theme="dark" />
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <UploadCloud className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-800">Verify Excel File</h2>
          </div>
            <p className="text-gray-600 text-sm mb-8 text-center leading-relaxed">
              Upload your Excel file to verify the data according to the database schema. This ensures consistency before insertion.
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              
            </label>
            <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6"
          />
          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="w-1/2 text-sm bg-gray-300 text-black hover:text-white hover:bg-black mt-2 items-center rounded py-2"
            >
              Reset form
            </button>
          </div>
          { errors.length > 0 && errors.some(e => e) && (
              <div className="mt-6">
            <h2 className="text-lg font-semibold">Errores detectados</h2>
            <ul className="list-disc ml-6">
              {errors.map((rowError, index) =>
                rowError ? (
                  <li key={index}>
                    <strong>Fila {index + 2}:</strong>
                    <ul className="ml-4 list-square text-red-600">
                      {rowError.map((err, idx) => (
                        <li key={idx}>{err}</li>
                      ))}
                    </ul>
                  </li>
                ) : null
              )}
            </ul>
          </div>
          )}
        </div>
      </div>

    </>
  );
};

export default CheckFilePage;
