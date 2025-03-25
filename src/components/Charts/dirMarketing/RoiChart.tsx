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
  Cell,
} from "recharts";

interface RoiChartProps {
  data: {
    name: string;
    cost: number;
    revenue: number;
  }[];
}

const RoiChart: React.FC<RoiChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-2xl">      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={40} // Reduce el grosor para mejor estética
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis
            dataKey="name"
            tickFormatter={(value) => {
              const date = new Date(value + "-01");
              return date.toLocaleString("default", { month: "short" }).toUpperCase();
            }}
            tick={{ fill: "#4B5563", fontSize: 12 }}
          />
          <YAxis
            tick={{ fill: "#4B5563", fontSize: 12 }}
            tickFormatter={(value) => `€${value.toLocaleString()}`}
          />
          <Tooltip formatter={(value) => `€${value.toLocaleString()}`} />
          <Legend wrapperStyle={{ color: "#6B7280", fontSize: "14px" }} />
          
          <Bar dataKey="cost" stackId="a" fill="#E63946" name="Costos" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-cost-${index}`} fill="#C53030" />
            ))}
          </Bar>
          
          <Bar dataKey="revenue" stackId="a" fill="#1E1E8A" name="Ingresos" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-revenue-${index}`} fill="#1E1E8A" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RoiChart;
