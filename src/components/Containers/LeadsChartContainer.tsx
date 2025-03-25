import React from 'react';
import CountChart from '../Charts/dirMarketing/LeadsChart';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import Link from 'next/link';

const LeadsChartContainer = async () => {
    // Obtener los leads agrupados por status, excluyendo "CLOSED"
    const leadsByStatus = await prisma.lead.groupBy({
        by: ['status'],
        _count: {
            id: true,
        },
        where: {
            status: {
                not: 'CLOSED',
            },
        },
    });

    // Calcular el total de leads que no están en "CLOSED"
    const totalLeads = leadsByStatus.reduce((sum, { _count }) => sum + _count.id, 0);

    // Separar cada estado en su propia constante
    const newLeads = leadsByStatus.find(({ status }) => status === 'NEW')?._count.id || 0;
    const contactedLeads = leadsByStatus.find(({ status }) => status === 'CONTACTED')?._count.id || 0;
    const qualifiedLeads = leadsByStatus.find(({ status }) => status === 'QUALIFIED')?._count.id || 0;

    return (
        <div className="bg-white rounded-xl w-full h-full p-4">
            {/* TITLE */}
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold ml-2">Active Leads</h1>
                <Link href="/director_comercial/details/leads">
                    <Image 
                        src="/moreDark.png" 
                        alt="" 
                        width={20} 
                        height={20}
                        className="cursor-pointer mr-2" 
                    />
                </Link>
            </div>

            {/* CHART */}
            <CountChart leadsByStatus={leadsByStatus} totalLeads={totalLeads} />

            {/* BOTTOM - Mostrar leads agrupados por status */}
            <div className="flex justify-center gap-8">
                <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#1E1E8A]" />
                    <h1 className="font-bold">{newLeads}</h1>
                    <h2 className="text-xs text-gray-500">
                        NEW ({Math.round((newLeads / (totalLeads)) * 100)}%)
                    </h2>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#8F70AC]" />
                    <h1 className="font-bold">{contactedLeads}</h1>
                    <h2 className="text-xs text-gray-500">
                        CONTACTED ({Math.round((contactedLeads / (totalLeads)) * 100)}%)
                    </h2>
                </div>
                <div className="flex flex-col items-center">
                    <div className="w-5 h-5 rounded-full bg-[#6600E4]" />
                    <h1 className="font-bold">{qualifiedLeads}</h1>
                    <h2 className="text-xs text-gray-500">
                        QUALIFIED ({Math.round((qualifiedLeads / (totalLeads)) * 100)}%)
                    </h2>
                </div>
                <div className="flex flex-col items-center ml-8">
                    <div className="w-5 h-5 rounded-full bg-[#6565DD]" />
                    <h1 className="font-bold">{totalLeads}</h1>
                    <h2 className="text-xs text-gray-500">TOTAL</h2>
                </div>
            </div>
        </div>
    );
};

export default LeadsChartContainer;