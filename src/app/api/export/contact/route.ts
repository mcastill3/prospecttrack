import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Parser } from "json2csv";

// API que maneja la exportación de contactos filtrados a CSV
export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // Filtros obtenidos desde los parámetros de la URL
  const firstNameFilter = searchParams.get("firstName") || "";
  const lastNameFilter = searchParams.get("lastName") || "";
  const emailFilter = searchParams.get("email") || "";
  const jobTitleFilter = searchParams.get("jobTitle") || "";
  const countryIdFilter = searchParams.get("countryId") || "";
  const cityIdFilter = searchParams.get("cityId") || "";

  // Consulta a la base de datos
  const contacts = await prisma.contact.findMany({
    where: {
      ...(firstNameFilter && {
        firstName: {
          contains: firstNameFilter,
          mode: "insensitive",
        },
      }),
      ...(lastNameFilter && {
        lastName: {
          contains: lastNameFilter,
          mode: "insensitive",
        },
      }),
      ...(emailFilter && {
        email: {
          contains: emailFilter,
          mode: "insensitive",
        },
      }),
      ...(jobTitleFilter && { jobTitle: jobTitleFilter as any }),
      ...(countryIdFilter && { countryId: countryIdFilter }),
      ...(cityIdFilter && { cityId: cityIdFilter }),
    },
    include: {
      country: { select: { name: true } },
      city: { select: { name: true } },
      company: { select: { name: true } },
    },
  });

  // Transformar contactos al formato plano para CSV
  const transformedContacts = contacts.map((contact) => ({
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone1: contact.phone1 || "",
    phone2: contact.phone2 || "",
    jobTitle: contact.jobTitle,
    type: contact.type,
    country: contact.country?.name || "",
    city: contact.city?.name || "",
    company: contact.company?.name || "",
  }));

  // Convertir a CSV
  const parser = new Parser();
  const csv = parser.parse(transformedContacts);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="contacts.csv"',
    },
  });
}
