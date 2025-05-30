// /app/api/export/list/excel/city/route.ts

import * as XLSX from "xlsx";

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

function formatSector(sector: string) {
  return sector
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function POST(req: Request) {
  const { contacts }: { contacts: Contact[] } = await req.json();

  if (!contacts || !Array.isArray(contacts)) {
    return new Response(
      JSON.stringify({ error: "Invalid data" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const rows = contacts.map((contact) => ({
    Company: contact.company?.name || "-",
    Sector: contact.company?.sector
      ? formatSector(contact.company.sector)
      : "N/A",
    Name: `${contact.firstName} ${contact.lastName}`,
    JobTitle: contact.jobTitle,
    Email: contact.email,
    Phone1: contact.phone1 || "-",
    Phone2: contact.phone2 || "-",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Prospection List");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  );

  return new Response(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="prospection_list.xlsx"',
    },
  });
}
