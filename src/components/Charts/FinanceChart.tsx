"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const FinanceChart = ({
  data,
}: {
  data: { name: string; cost: number }[]; // Ahora tiene un solo campo "cost"
}) => {
  return (
    <div className="rounded-xl w-full h-full p-4 mt-10">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#6b7280" }}
            tickLine={false}
            tickMargin={10}
            tickFormatter={(value) => {
              const date = new Date(value + "-01"); // Convertir a fecha para obtener el mes
              return date.toLocaleString("default", { month: "short" }).toUpperCase(); // Mostrar en mayúsculas
            }}
          />
          <YAxis
            tick={{ fill: "#6b7280" }}
            tickLine={false}
            tickMargin={20}
            domain={[0, (dataMax: number) => Math.ceil(dataMax / 1000) * 1000]}  // Establecemos el límite superior dinámicamente
            hide={false}
            tickCount={5}
            type="number"
            allowDataOverflow
          />
          <Tooltip />
          <Legend align="center" verticalAlign="top" wrapperStyle={{ paddingBottom: "10px" }} />
          <Line
            type="monotone"
            dataKey="cost"  // Ahora solo mostramos el campo "cost"
            stroke="#1E1E8A"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;