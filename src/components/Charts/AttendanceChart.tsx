"use client"
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

const AttendanceChart = ({
  data,
}: {
  data: { name: string; campaigns: number; events: number }[];
}) => {
  return (
    <ResponsiveContainer width="100%" height="90%">
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
        <XAxis
          dataKey="name"
          axisLine={false}
          tick={{ fill: "#d1d5db" }}
          tickLine={false}
          tickFormatter={(value) => {
            // Formato: '2025-01' -> 'JAN'
            const date = new Date(value + "-01"); // Convertir a fecha para obtener el mes
            return date.toLocaleString("default", { month: "short" }).toUpperCase(); // Mostrar en mayúsculas
          }}
        />
        <YAxis 
          axisLine={false} 
          tick={{ fill: "#d1d5db" }} 
          tickLine={false}
          tickFormatter={(value) => Math.floor(value).toString()}  
          ticks={[0, 5, 10, 15, 20]}  // Ticks personalizados
        />
        <Tooltip
          contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
        />
        <Legend
          align="left"
          verticalAlign="top"
          wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
        />
        <Bar
          dataKey="campaigns"
          fill="#1E1E8A"
          legendType="circle"
          radius={[10, 10, 0, 0]}
        />
        <Bar
          dataKey="events"
          fill="#8F70AC"
          legendType="circle"
          radius={[10, 10, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AttendanceChart;