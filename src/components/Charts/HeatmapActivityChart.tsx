"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Import dinámico porque ApexCharts usa window (que no existe en SSR)
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });


const fullNameMap: Record<string, string> = {
  AGR: "AGRICULTURE_AND_FARMING",
  CONST: "CONSTRUCTION_AND_INFRASTRUCTURE",
  CONS: "CONSUMER_AND_RETAIL",
  DEF: "DEFENSE_AND_SECURITY",
  DES: "DESIGN_AND_CREATIVE",
  EDU: "EDUCATION",
  ENER: "ENERGY_AND_ENVIRONMENT",
  EVHOSP: "EVENTS_AND_HOSPITALITY",
  FIN: "FINANCE_AND_INSURANCE",
  HLTH: "HEALTH_AND_WELLNESS",
  IND: "INDUSTRY_AND_MANUFACTURING",
  IT: "INFORMATION_TECHNOLOGY_AND_SERVICES",
  LOG: "LOGISTICS_AND_TRANSPORTATION",
  MED: "MEDIA_AND_ENTERTAINMENT",
  NNP: "NON_PROFITS_AND_PHILANTHROPY",
  OTH: "OTHER_MATERIALS_AND_PRODUCTION",
  PHAR: "PHARMACEUTICALS",
  PROF: "PROFESSIONAL_SERVICES_AND_CONSULTING",
  PUB: "PUBLIC_SECTOR_AND_GOVERNMENT",
  REAL: "REAL_ESTATE",
  TECH: "TECHNOLOGY_AND_TELECOMMUNICATIONS",
};


type Props = {
  data: Record<string, number>;
};

const HeatmapActivityChart: React.FC<Props> = ({ data }) => {
  const series = [
    {
      name: "Leads Count",
      data: Object.entries(data).map(([type, count]) => ({
        x: type,
        y: count,
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
  colors: ["#FF5733", "#FF8D1A", "#FFC300"],
  xaxis: {
    type: "category",
    categories: Object.keys(data),
    labels: {
      rotate: -45,
      style: { fontSize: "12px" },
    },
  },
  tooltip: {
    y: {
      formatter: (val: number, opts) => {
        const categories = opts.w.config.xaxis.categories as string[] | undefined;
        const abbr = categories ? categories[opts.dataPointIndex] : undefined;
        const fullName = abbr ? fullNameMap[abbr] ?? abbr : "Unknown sector";
        return `${val} leads in ${fullName.replace(/_/g, " ")}`;
      },
    },
  },
};


  return (
    <div>
      <Chart options={options} series={series} type="heatmap" height={350} />
    </div>
  );
};

export default HeatmapActivityChart;
