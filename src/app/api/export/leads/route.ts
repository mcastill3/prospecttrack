import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Parser } from "json2csv";

// GET /api/export/leads/route.ts
export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // Obtenemos los filtros de los parámetros de la URL
  const name = searchParams.get("name") || undefined;
  const accountManager = searchParams.get("accountManager") || undefined;
  const status = searchParams.get("status") || undefined;
  const source = searchParams.get("source") || undefined;
  const rawStartDate = searchParams.get("startDate") || undefined;
  const rawEndDate = searchParams.get("endDate") || undefined;

  const startDate = rawStartDate ? new Date(rawStartDate) : undefined;
  const endDate = rawEndDate ? new Date(rawEndDate) : undefined;

  if (endDate) {
    endDate.setHours(23, 59, 59, 999); // Aseguramos que el filtro de fecha final abarque todo el día
  }

  // Consulta de leads con los filtros aplicados
  const leads = await prisma.lead.findMany({
    where: {
      ...(name && {
        OR: [
          { contact: { firstName: { contains: name, mode: "insensitive" } } },
          { contact: { lastName: { contains: name, mode: "insensitive" } } },
        ],
      }),
      ...(accountManager && {
        accountManager: {
          OR: [
            { firstName: { contains: accountManager, mode: "insensitive" } },
            { lastName: { contains: accountManager, mode: "insensitive" } },
          ],
        },
      }),
      ...(status && { status: status as any }),
      ...(source && { activity: { type: source as any } }),
      ...(startDate && endDate && { createdAt: { gte: startDate, lte: endDate } }),
      ...(startDate && !endDate && { createdAt: { gte: startDate } }),
      ...(endDate && !startDate && { createdAt: { lte: endDate } }),
    },
    include: {
      accountManager: { select: { firstName: true, lastName: true } },
      contact: { select: { firstName: true, lastName: true } },
      activity: { select: { type: true } },
      company: { select: { name: true } },
    },
  });

  // Transformar a un formato plano para CSV
  const transformedLeads = leads.map((lead) => ({
    id: lead.id,
    name: `${lead.contact?.firstName} ${lead.contact?.lastName}`,
    accountManager: `${lead.accountManager?.firstName} ${lead.accountManager?.lastName}`,
    status: lead.status,
    source: lead.activity?.type || "",
    company: lead.company?.name || "",
    createdAt: lead.createdAt.toISOString().split("T")[0],
  }));

  // Crear el archivo CSV
  const parser = new Parser();
  const csv = parser.parse(transformedLeads);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="leads.csv"',
    },
  });
}
