import React from 'react';
import prisma from '@/lib/prisma';
import CompanyChart from '../Charts/dirMarketing/CompanyChart';
import Image from 'next/image';
import Link from 'next/link';

// Definimos un nuevo tipo que evita `null` en `industry`
type SafeCompany = {
    id: string;
    name: string;
    industry: string;
    size: number;
    country: string;
    city: string;
};

const CompanyChartContainer = async () => {
    // Obtener la información de las compañías
    const companies = await prisma.company.findMany({
        select: {
            id: true,
            name: true,
            industry: true,
            size: true,
            country: true,
            city: true,
        },
        orderBy: {
            name: 'asc', // Ordenar por nombre alfabéticamente
        },
    });

    // Convertir `industry` de `null` a `"Unknown"` y usar el nuevo tipo `SafeCompany`
    const formattedCompanies: SafeCompany[] = companies.map(company => ({
        ...company,
        industry: company.industry ?? "Unknown", // Si `industry` es `null`, asigna "Unknown"
    }));

    return (
        <div className="bg-white rounded-xl w-full h-full p-4">
            {/* TITLE */}
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold ml-2">Companies Overview</h1>
                <Link href="/director_comercial/details/companies">
                    <Image 
                        src="/moreDark.png" 
                        alt="" 
                        width={20} 
                        height={20}
                        className="cursor-pointer mr-2" 
                    />
                </Link>
            </div>

            {/* TABLE */}
            <CompanyChart companies={formattedCompanies} />
        </div>
    );
};

export default CompanyChartContainer;