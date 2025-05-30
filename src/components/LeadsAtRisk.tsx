import classNames from "classnames";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Lead, AccountManager, Company } from "@prisma/client";

// Define el tipo de Lead con relaciones necesarias
type LeadWithRelations = Lead & {
  accountManager: Pick<AccountManager, "firstName" | "lastName"> | null;
  company: Pick<Company, "name" | "sector"> | null;
};

type LeadsAtRiskProps = {
  leads: LeadWithRelations[];
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
};

const getRiskLevel = (updatedAt: Date) => {
  const now = new Date();
  const daysDifference = Math.floor(
    (now.getTime() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDifference > 10) return { label: "High", color: "bg-red-600 text-white animate-pulse" };
  if (daysDifference > 5) return { label: "Medium", color: "bg-yellow-500 text-black" };
  return { label: "Low", color: "bg-green-500 text-white" };
};

const LeadsAtRisk = ({ leads }: LeadsAtRiskProps) => {
  const totalValueAtRisk = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border min-h-[30vh] flex flex-col">
      {/* Header Info Box */}
      <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 flex justify-between items-center shadow">
        <span className="text-lg font-semibold">Estimated value at risk:</span>
        <span className="text-xl font-bold">{formatCurrency(totalValueAtRisk)}</span>
      </div>

      {/* Table */}
      <Table className="min-w-full border-collapse">
        <TableHeader className="bg-gray-900 text-white font-semibold">
          <TableRow>
            <TableHead className="py-4 px-6 text-left text-white">Lead</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Company</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Sector</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Account Manager</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Last Update</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Estimated Value (€)</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Risk</TableHead>
            <TableHead className="py-4 px-6 text-left text-white">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => {
            const risk = getRiskLevel(lead.updatedAt);
            return (
              <TableRow key={lead.id} className="hover:bg-gray-300">
                <TableCell className="py-4 px-6 text-left text-xs">{lead.name}</TableCell>
                <TableCell className="py-4 px-6 text-left text-xs">
                  {lead.company?.name || "N/A"}
                </TableCell>
                <TableCell className="py-4 px-6 text-left text-xs">
                  {lead.company?.sector ? lead.company.sector.replace(/_/g, " ") : "Desconocida"}
                </TableCell>
                <TableCell className="py-4 px-6 text-left text-xs">
                  {lead.accountManager
                    ? `${lead.accountManager.firstName} ${lead.accountManager.lastName}`
                    : "Marketing - TBA"}
                </TableCell>
                <TableCell className="py-4 px-6 text-left text-xs">
                  {new Date(lead.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="py-4 px-6 text-left text-xs">
                  {formatCurrency(lead.value || 0)}
                </TableCell>
                <TableCell>
                  <span className={classNames("px-3 py-1 rounded-md font-semibold", risk.color)}>
                    {risk.label}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="default" size="sm">
                    Contact
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadsAtRisk;