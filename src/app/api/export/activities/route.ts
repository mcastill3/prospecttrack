import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Parser } from "json2csv";

// GET /api/activities/export
export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const type = searchParams.get("type") || undefined;
  const status = searchParams.get("status") || undefined;
  const areaId = searchParams.get("areaId") || undefined;
  const rawStartDate = searchParams.get("startDate") || undefined;
  const rawEndDate = searchParams.get("endDate") || undefined;

  const startDate = rawStartDate ? new Date(rawStartDate) : undefined;
  const endDate = rawEndDate ? new Date(rawEndDate) : undefined;

  if (endDate) {
    endDate.setHours(23, 59, 59, 999); // Incluir día completo
  }

  const activities = await prisma.activity.findMany({
    where: {
      ...(type && { type: type as any }),
      ...(status && { status: status as any }),
      ...(areaId && { areaId }),
      ...(startDate && endDate && {
        date: { gte: startDate, lte: endDate }
      }),
      ...(startDate && !endDate && { date: { gte: startDate } }),
      ...(endDate && !startDate && { date: { lte: endDate } }),
    },
    include: {
      cost: true,
      area: true,
      leads: {
        select: {
          name: true,
          company: {
            select: { name: true }
          },
          contact: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      }
    }
  });

  // Transformar a un formato plano para CSV
  const transformed = activities.map((activity) => ({
    id: activity.id,
    name: activity.name,
    type: activity.type,
    date: activity.date.toISOString().split("T")[0],
    area: activity.area?.name || "",
    costAmount: activity.cost?.amount || "",
    costCurrency: activity.cost?.currency || "",
    leads: activity.leads.map(l => l.name).join(", "),
    companies: activity.leads.map(l => l.company?.name).join(", "),
    contacts: activity.leads.map(l => `${l.contact?.firstName || ""} ${l.contact?.lastName || ""}`).join(", "),
  }));

  const parser = new Parser();
  const csv = parser.parse(transformed);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="activities.csv"',
    },
  });
}