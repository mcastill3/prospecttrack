import LeadsAtRisk from "@/components/LeadsAtRisk";
import Pagination from "@/components/Pagination";
import { ITEM_PER_PAGE } from "@/lib/settings";
import prisma from "@/lib/prisma";
import React from "react";
import LeadAtRiskFilter from "@/components/Filters/LeadAtRiskFilter";

const TrackingPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const page = parseInt(searchParams.page || "1", 10);
  const startIndex = (page - 1) * ITEM_PER_PAGE;


function calculateRisk(updatedAt: Date): "Low Risk" | "Medium Risk" | "High Risk" {
  const daysSinceUpdate = Math.floor((Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceUpdate <= 14) return "Low Risk";
  if (daysSinceUpdate <= 30) return "Medium Risk";
  return "High Risk";
}

  const {
    name,
    company,
    sector,
    risk,
    startDate,
    endDate,
    accountManager,
  } = searchParams;

  const filters: any = {
    status: { notIn: ["CLOSED"] },
  };

  // Aplicar filtros de búsqueda desde la URL
  if (name) {
    filters.name = { contains: name, mode: "insensitive" };
  }

  if (company) {
    filters.company = {
      is: {
        name: { contains: company, mode: "insensitive" },
      },
    };
  }

  // Filtro para el sector usando "equals" en lugar de "contains"
  if (sector) {
    filters.company = {
      ...(filters.company || {}),
      is: {
        ...(filters.company?.is || {}),
        sector: sector,  // Usa "sector" directamente como valor del enum
      },
    };
  }

  if (accountManager) {
    filters.accountManager = {
      is: {
        OR: [
          { firstName: { contains: accountManager, mode: "insensitive" } },
          { lastName: { contains: accountManager, mode: "insensitive" } },
        ],
      },
    };
  }

  // Filtro para la fecha de actualización
  if (startDate || endDate) {
  filters.updatedAt = {};

  if (startDate) {
    filters.updatedAt.gte = new Date(startDate);
  }

  if (endDate) {
    // Ajuste opcional: sumar un día para incluir el final del día en la búsqueda
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);
    filters.updatedAt.lte = end;
  }
}


  const allLeads = await prisma.lead.findMany({
  where: filters,
  include: {
    accountManager: { select: { firstName: true, lastName: true } },
    contact: { select: { firstName: true, lastName: true } },
    company: { select: { id: true, name: true, revenue: true, sector: true } },
    activity: { select: { id: true, type: true, date: true } },
  },
  orderBy: { createdAt: 'desc' },
});

// Añadir campo `risk` calculado
const allLeadsWithRisk = allLeads.map((lead) => ({
  ...lead,
  risk: calculateRisk(lead.updatedAt),
}));

// Filtrar por risk si se especifica
const filteredLeads = risk
  ? allLeadsWithRisk.filter((lead) => lead.risk === risk)
  : allLeadsWithRisk;

  const totalCount = risk
  ? filteredLeads.length // ya está filtrado por riesgo
  : await prisma.lead.count({ where: filters });

// Paginación manual
const paginatedLeads = filteredLeads.slice(startIndex, startIndex + ITEM_PER_PAGE);



  return (
    <>
      <div className="mt-10 rounded-lg shadow">
        <LeadAtRiskFilter totalCount={totalCount} />
        <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-300 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700">Leads</h2>
        </div>
        <div className="bg-white p-4 rounded-b-lg">
          <LeadsAtRisk leads={paginatedLeads} />
          <Pagination page={page} count={totalCount} />     
        </div>
      </div>
    </>
  );
};

export default TrackingPage;