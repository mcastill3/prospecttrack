"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import React from "react";

// Import dinámico porque ApexCharts usa window (no SSR)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  data: Record<string, number>; // { abbrevSector: count }
};

// Mapea abreviatura a sector completo para tooltip
const fullNameMap: Record<string, string> = {
  "Agric.": "AGRICULTURE_AND_FARMING",
  "Constr.": "CONSTRUCTION_AND_INFRASTRUCTURE",
  "Cons/Retail": "CONSUMER_AND_RETAIL",
  Defense: "DEFENSE_AND_SECURITY",
  Design: "DESIGN_AND_CREATIVE",
  Edu: "EDUCATION",
  Energy: "ENERGY_AND_ENVIRONMENT",
  Events: "EVENTS_AND_HOSPITALITY",
  Finance: "FINANCE_AND_INSURANCE",
  Health: "HEALTH_AND_WELLNESS",
  Industry: "INDUSTRY_AND_MANUFACTURING",
  "IT & Services": "INFORMATION_TECHNOLOGY_AND_SERVICES",
  Logistics: "LOGISTICS_AND_TRANSPORTATION",
  Media: "MEDIA_AND_ENTERTAINMENT",
  "Non-Profit": "NON_PROFITS_AND_PHILANTHROPY",
  "Other Mat.": "OTHER_MATERIALS_AND_PRODUCTION",
  Pharma: "PHARMACEUTICALS",
  "Prof. Services": "PROFESSIONAL_SERVICES_AND_CONSULTING",
  "Public Sector": "PUBLIC_SECTOR_AND_GOVERNMENT",
  "Real Estate": "REAL_ESTATE",
  "Tech & Telecom": "TECHNOLOGY_AND_TELECOMMUNICATIONS",
};

const HeatmapSectorChart: React.FC<Props> = ({ data }) => {
  const abbreviatedLabels = Object.keys(data);

  const series = [
    {
      name: "Leads Count",
      data: abbreviatedLabels.map((abbr) => ({
        x: abbr,
        y: data[abbr],
      })),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "heatmap",
      toolbar: { show: false },
    },
    dataLabels: {
      enabled: true,
      style: { colors: ["#fff"] },
    },
    colors: ["#FF5733", "#FF8D1A", "#FFC300"], // naranja-rojo gradient (ajusta si quieres)
    xaxis: {
      type: "category",
      labels: {
        rotate: -45,
        style: { fontSize: "12px" },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number, opts) => {
          const dataPointIndex = opts.dataPointIndex;
          const abbr = abbreviatedLabels[dataPointIndex] ?? "Unknown";
          const fullName = fullNameMap[abbr] ?? abbr;
          return `${val} leads in ${fullName.replace(/_/g, " ")}`;
        },
      },
    },
  };

  return <Chart options={options} series={series} type="heatmap" height={350} />;
};

export default HeatmapSectorChart;