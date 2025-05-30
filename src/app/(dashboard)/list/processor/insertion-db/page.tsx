'use client';

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { insertContactsFromExcel } from '@/actions/insertContactsFromExcel';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import { DatabaseBackup } from 'lucide-react';

const contactSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().optional(),
  phone1: z.string().optional(),
  phone2: z.string().optional(),
  country: z.string(),
  city: z.string().optional(),
  jobTitle: z.string(),
  type: z.string(),
  companyName: z.string(),
  sector: z.string().optional(),
  companySize: z.coerce.number().optional(),
  source: z.string(),
  website:z.string().optional(),
  revenue: z.coerce.number().optional(),
});

export default function ProcessorInsertionPage() {
  const [fileName, setFileName] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isInserting, setIsInserting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const validData = [];
      for (const rawItem of jsonData) {
        const item = rawItem as any;

        if (item.phone1 !== undefined) item.phone1 = String(item.phone1);
        if (item.phone2 !== undefined) item.phone2 = String(item.phone2);

        const result = contactSchema.safeParse(item);
        if (!result.success) {
          const messages = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
          setError(`Error en el archivo: ${messages}`);
          return;
        }

        validData.push(result.data);
      }

      setContacts(validData);
      setError('');
    };

    reader.readAsArrayBuffer(file);
  };

  const handleInsert = async () => {
  try {
    if (contacts.length === 0) {
      setError('No hay contactos válidos para insertar.');
      return;
    }

    setIsInserting(true); // 🔒 Bloquear UI

    await insertContactsFromExcel(contacts);

    setSuccess('¡Contactos insertados con éxito!');
    toast.success('¡Contactos insertados con éxito!');
    setError('');
  } catch (err) {
    console.error(err);
    setError('Error al insertar los contactos.');
    toast.error('Error al insertar los contactos.');
  } finally {
    setIsInserting(false); // 🔓 Desbloquear UI
  }
};


  const handleReset = () => {
  setFileName('');
  setContacts([]);
  setError('');
  setSuccess('');

  // Limpia el input de archivo manualmente
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  if (input) {
    input.value = '';
  }

  toast.info("Formulario restablecido. Puedes subir otro archivo.");
};

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2 mt-10">
          <h1 className="text-3xl font-bold">DB Insertion</h1>
          <p className="text-gray-500">DB updating</p>
        </div>
          <Button asChild variant={"outline"}>
            <Link href={"/list/processor"}>Back to generator</Link>
          </Button>
      </div>
      <div className="min-h-screen flex items-start justify-center pt-24">
        
        <ToastContainer position="bottom-right" theme="dark" />
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <DatabaseBackup className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-800">Upload information - DB</h2>
          </div>
            <p className="text-gray-600 text-sm mb-8 text-center leading-relaxed">
              Upload your Excel file to insert information into the database.
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              
            </label>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-6"
            />
            {fileName && <p className="text-sm text-gray-700 mb-2"></p>}
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleInsert}
                  disabled={contacts.length === 0 || isInserting}
                >
                  {isInserting ? 'Inserting...' : 'Upload information'}
                </button>
                <button
                  onClick={handleReset}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  disabled={isInserting}
                >
                  Reset form
                </button>
              </div>
              {isInserting && (
                <div className="text-center text-blue-600 mt-4">
                  ⏳ Insertando contactos en la base de datos...
                </div>
              )}


              {success && <p className="text-green-600 mt-4">{success}</p>}
              {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
  </div>
    </>
  );
}