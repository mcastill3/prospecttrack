"use client";

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import normalizeSector from '../../../../../components/processor/normalizeSector';
import normalizeSize from '../../../../../components/processor/normalizeSize';
import normalizeRevenue from '../../../../../components/processor/normalizeRevenue';
import normalizeJobTitle from '../../../../../components/processor/normalizeJobTitle';
import { Download, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ParsingFilePage: React.FC = () => {
  const [normalizedData, setNormalizedData] = useState<any[] | null>(null);
  const [columnsOk, setColumnsOk] = useState(false);

  const expectedColumns = [
    'companyName', 'sector', 'size', 'website', 'revenue',
    'country', 'city', 'firstName', 'lastName', 'email',
    'phone1', 'phone2', 'jobTitle', 'type'
  ];

  const normalize = (s: string) => s.trim().toLowerCase();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (jsonData.length === 0) {
        toast.error('El archivo está vacío.');
        setColumnsOk(false);
        setNormalizedData(null);
        return;
      }

      const headers = Object.keys(jsonData[0]);
      const normalizedHeaders = headers.map(normalize);
      const missingColumns = expectedColumns.filter(
        col => !normalizedHeaders.includes(normalize(col))
      );

      if (missingColumns.length > 0) {
        toast.error(`Faltan columnas requeridas: ${missingColumns.join(', ')}`);
        setColumnsOk(false);
        setNormalizedData(null);
        return;
      }

      try {
        let fakeEmailCounter = 1;
        const usedEmails = new Set<string>();

        const newData = jsonData.map((row, index) => {
          const rawSize = row['size'] || '';
          const normalizedSize = normalizeSize(rawSize);
          const normalizedJobTitle = normalizeJobTitle(row['jobTitle'] || '');

          const rawRevenue = row['revenue'] || '';
          const normalizedRevenue = normalizeRevenue(rawRevenue);

          // Obtener y limpiar el email original
          let email = (row['email'] || '').trim().toLowerCase();

          // Validar formato básico de email (opcional)
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const isValidEmail = emailRegex.test(email);

          if (!isValidEmail) {
            // Generar uno nuevo asegurando que no exista
            do {
              email = `noemail${fakeEmailCounter}@neverhack.com`;
              fakeEmailCounter++;
            } while (usedEmails.has(email));
          }

          usedEmails.add(email);

          return {
            ...row,
            email,
            sector: normalizeSector(row['sector'] || ''),
            size: normalizedSize,
            revenue: normalizedRevenue,
            jobTitle: normalizedJobTitle,
          };
        });

        toast.success('File validated and normalized correctly!');
        setColumnsOk(true);
        setNormalizedData(newData);
      } catch (error: any) {
        toast.error(error.message);
        setColumnsOk(false);
        setNormalizedData(null);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const downloadNormalizedExcel = () => {
  if (!normalizedData) return;

  const worksheet = XLSX.utils.json_to_sheet(normalizedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Normalized');

  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/octet-stream' });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'normalized_data.xlsx';
  a.click();
  window.URL.revokeObjectURL(url);

  // ✅ Toast de confirmación
  toast.success("Normalized Excel downloaded successfully!");

  // Refrescar pantalla (client-side)
  setTimeout(() => {
    window.location.reload();
  }, 1000);
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
            <h2 className="text-2xl font-semibold text-gray-800">Normalize Excel File</h2>
          </div>

          <p className="text-gray-600 text-sm mb-8 text-center leading-relaxed">
            Upload your Excel file to convert and standardize its data according to the database schema. This ensures consistency before insertion.
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6"
          />

          {columnsOk && normalizedData && (
            <button
              onClick={downloadNormalizedExcel}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Normalized Excel
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ParsingFilePage;