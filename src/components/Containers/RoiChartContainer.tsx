import React from "react";
import prisma from "@/lib/prisma";
import RoiChart from "../Charts/dirMarketing/RoiChart";

const RoiChartContainer = async () => {
    // Obtener los costos de campañas y eventos agrupados por mes
    const campaignCosts = await prisma.activity.findMany({
        select: {
            date: true,
            cost: { select: { amount: true } },
        },
    });

    

    // Obtener los ingresos de los leads agrupados por mes
    const leadRevenues = await prisma.lead.findMany({
        select: {
            createdAt: true,
            value: true,
        },
    });

    // Función para formatear la fecha en "YYYY-MM"
    const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    };

    // Estructuras para almacenar los datos agrupados
    const monthlyData: Record<string, { cost: number; revenue: number }> = {};

    // Procesar costos de campañas
    campaignCosts.forEach(({ date, cost }) => {
        const month = formatDate(date);
        if (!monthlyData[month]) monthlyData[month] = { cost: 0, revenue: 0 };
        monthlyData[month].cost += cost?.amount || 0;
    });

    // Procesar costos de eventos
   

    // Procesar ingresos de los leads
    leadRevenues.forEach(({ createdAt, value }) => {
        const month = formatDate(createdAt);
        if (!monthlyData[month]) monthlyData[month] = { cost: 0, revenue: 0 };
        monthlyData[month].revenue += value || 0;
    });

    // Convertir objeto en un array de datos formateados
    const formattedData = Object.entries(monthlyData).map(([month, { cost, revenue }]) => ({
        name: month, // Nombre del mes
        cost,        // Costo total (campañas + eventos)
        revenue,     // Ingreso total de leads
    }));

    return (
        <div className="bg-white rounded-xl w-full h-full p-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">ROI: Costos vs Ingresos</h2>
            <RoiChart data={formattedData} />
        </div>
    );
};

export default RoiChartContainer;
