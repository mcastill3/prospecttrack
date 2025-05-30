import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Parser } from "json2csv";

// Calcular nivel de riesgo según días sin actualizar
function calculateRisk(updatedAt: Date): "High Risk" | "Medium Risk" | "Low Risk" {
  const daysWithoutUpdate = (new Date().getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);

  if (daysWithoutUpdate > 30) return "High Risk";
  if (daysWithoutUpdate > 15) return "Medium Risk";
  return "Low Risk";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const name = searchParams.get("name") || undefined;
  const company = searchParams.get("company") || undefined;
  const sector = searchParams.get("sector") || undefined;
  const accountManager = searchParams.get("accountManager") || undefined;
  const rawLastUpdate = searchParams.get("lastUpdate") || undefined;
  const riskFilter = searchParams.get("risk") || undefined;

  const lastUpdate = rawLastUpdate ? new Date(rawLastUpdate) : undefined;

  const leads = await prisma.lead.findMany({
    where: {
      status: { notIn: ["CLOSED"] },
      ...(name && {
        contact: {
          OR: [
            { firstName: { contains: name, mode: "insensitive" } },
            { lastName: { contains: name, mode: "insensitive" } },
          ],
        },
      }),
      ...(company && {
        company: {
          name: { contains: company, mode: "insensitive" },
        },
      }),
      ...(sector && {
        company: {
          ...(company
            ? { name: { contains: company, mode: "insensitive" } }
            : {}),
          sector: sector as any, // Exact match for enum
        },
      }),
      ...(accountManager && {
        accountManager: {
          OR: [
            { firstName: { contains: accountManager, mode: "insensitive" } },
            { lastName: { contains: accountManager, mode: "insensitive" } },
          ],
        },
      }),
      ...(lastUpdate && {
        updatedAt: { lte: new Date(lastUpdate.setHours(23, 59, 59, 999)) },
      }),
    },
    include: {
      contact: { select: { firstName: true, lastName: true } },
      accountManager: { select: { firstName: true, lastName: true } },
      company: { select: { name: true, sector: true } },
    },
  });

  // Agregar riesgo y filtrar si se especificó
  const filteredLeads = leads
    .map((lead) => {
      const risk = calculateRisk(lead.updatedAt);
      return {
        ...lead,
        risk,
        contactName: `${lead.contact?.firstName || ""} ${lead.contact?.lastName || ""}`.trim(),
        accountManagerName: `${lead.accountManager?.firstName || ""} ${lead.accountManager?.lastName || ""}`.trim(),
        companyName: lead.company?.name || "",
      };
    })
    .filter((lead) => !riskFilter || lead.risk === riskFilter);

  const csvData = filteredLeads.map((lead) => ({
    id: lead.id,
    name: lead.contactName,
    accountManager: lead.accountManagerName,
    company: lead.companyName,
    sector: lead.company?.sector || "",
    lastUpdate: lead.updatedAt.toISOString().split("T")[0],
    risk: lead.risk,
  }));

  const parser = new Parser();
  const csv = parser.parse(csvData);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="leads_at_risk.csv"',
    },
  });
}
