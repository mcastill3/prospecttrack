import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Campaign, Company, Cost, Event, Lead, Player, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import LeadsAtRisk from "@/components/LeadsAtRisk";

type LeadList = Lead & {
    players: Player[];
    campaign?: Campaign;
    event?: Event;
    company?: Company;
    cost: Cost | null;
};

const LeadListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const query: Prisma.LeadWhereInput = {};
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "playerId":
                        query.players = { some: { id: value } };
                        break;
                    case "playername":
                        query.players = { some: { name: { contains: value, mode: "insensitive" } } };
                        break;
                    case "search":
                        query.name = { contains: value, mode: "insensitive" };
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.lead.findMany({
            where: query,
            include: {
                campaign: { select: { name: true } },
                event: { select: { name: true } },
                company: { select: { name: true } },
                players: { select: { id: true, name: true, surname: true } },
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
            orderBy: { createdAt: "asc" },
        }),
        prisma.lead.count({ where: query }),
    ]);

    return (
        <Card className="p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold">Leads</h1>
                <div className="flex items-center gap-4">
                    <TableSearch />
                    <Button className="bg-lamaYellow rounded-full">
                        <Image src="/filter.png" alt="Filter" width={14} height={14} />
                    </Button>
                    <Button className="bg-lamaYellow rounded-full">
                        <Image src="/sort.png" alt="Sort" width={14} height={14} />
                    </Button>
                    <FormModal table="lead" type="create" />
                </div>
            </div>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
            <Table className="min-w-full border-collapse">
                <TableHeader className="bg-gray-900 text-white font-semibold">
                    <TableRow>
                        <TableHead className="py-4 px-6 text-left font-semibold text-white">Lead</TableHead>
                        <TableHead className="py-4 px-6 text-left font-semibold text-white">Source</TableHead>
                        <TableHead className="py-4 px-6 text-left font-semibold text-white">Creation Date</TableHead>
                        <TableHead className="py-4 px-6 text-left font-semibold text-white">Status</TableHead>
                        <TableHead className="py-4 px-6 text-left font-semibold text-white">Last Action Date</TableHead>
                        <TableHead className="py-4 px-6 text-left font-semibold text-white">Commercial Manager</TableHead>
                        <TableHead className="py-4 px-6 text-left font-semibold text-white">Customer</TableHead>
                        <TableHead className="py-4 px-6 text-left font-semibold text-white">Estimated Value</TableHead>
                        <TableHead className="py-4 px-6 text-left font-semibold text-white">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.id} className="hover:bg-gray-100">
                            <TableCell>{item.name}</TableCell>
                            <TableCell className="text-center">{item.campaign ? "Campaña" : item.event ? "Evento" : "Desconocido"}</TableCell>
                            <TableCell className="text-center">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-center">{item.status}</TableCell>
                            <TableCell className="text-center">{new Date(item.updatedAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-center">{item.players.map(player => `${player.name} ${player.surname}`).join(", ")}</TableCell>
                            <TableCell className="text-center">{item.company?.name}</TableCell>
                            <TableCell className="text-center">{item.value} €</TableCell>
                            <TableCell className="flex gap-2">
                                <Link href={`/list/lead/${item.id}`}>
                                <Button className="bg-lamaBlue rounded-full p-0 h-7 w-7 flex items-center justify-center">
                                      <Image src="/view.png" alt="View" width={12} height={12} />
                                </Button>
                                </Link>
                                <FormModal table="lead" type="update" id={item.id} />
                                {role === "admin" && <FormModal table="lead" type="delete" id={item.id} />}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            
            </div>
            <Pagination page={p} count={count} />

            <LeadsAtRisk />
        </Card>
        
    );
};

export default LeadListPage;
