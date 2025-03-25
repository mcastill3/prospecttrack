"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarSegmentationChartProps {
  data: {
    industry: string;
    totalLeads: number;
    generatedLeads: number; // Cambiado de "effectiveness" a "generatedLeads"
  }[];
}

const BarSegmentationChart: React.FC<BarSegmentationChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-2 rounded-2xl">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="industry" tick={{ fill: "#4B5563", fontSize: 12 }} />
          <YAxis tick={{ fill: "#4B5563", fontSize: 12 }} allowDecimals={false} />
          <Tooltip />
          <Legend wrapperStyle={{ color: "#6B7280", fontSize: "14px" }} />

          {/* Barra para el número de leads generados por industria */}
          <Bar
            dataKey="generatedLeads"
            fill="#1E88E5" // Color de la barra para los leads generados
            name="Leads Generados"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarSegmentationChart;