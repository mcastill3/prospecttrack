import ConversionResources from "@/components/ConversionResources";
import RecentActivities from "@/components/RecentActivities";
import TablePerformance from "@/components/Tables/TablePerformance";
import React from "react";

const RightPanelAnalystM = () => {
  return (
    <div className="w-full flex flex-col gap-6">
      

      {/* Oportunidades Clave en Riesgo */}
      <div className="bg-white  rounded-lg p-4 w-full">
        <TablePerformance />
      </div>

      {/* Recursos y Estrategias de Conversión */}
      <div className="bg-white  rounded-lg p-4 w-full">
        <h2 className="text-lg font-semibold text-gray-700">
          📌 Knowledge Base
        </h2>
        <ConversionResources />
      </div>
    </div>
  );
};

export default RightPanelAnalystM;