import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone1?: string;
  phone2?: string;
  jobTitle: string;
}

interface Company {
  name: string;
  sector: string;
  contacts: Contact[];
}

function formatSector(sector: string) {
  return sector
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function POST(req: Request) {
  const { companies }: { companies: Company[] } = await req.json();

  if (!companies || !Array.isArray(companies)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const rows = companies.flatMap((company) =>
    company.contacts.map((contact) => ({
      Company: company.name,
      Sector: formatSector(company.sector),
      Name: `${contact.firstName} ${contact.lastName}`,
      JobTitle: contact.jobTitle,
      Email: contact.email,
      Phone1: contact.phone1 || "-",
      Phone2: contact.phone2 || "-",
    }))
  );

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Prospection List");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="prospection_list.xlsx"',
    },
  });
}
