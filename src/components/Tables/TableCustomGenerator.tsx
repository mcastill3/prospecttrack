import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone1?: string | null;
  phone2?: string | null;
  jobTitle: string;
  company?: {
    name: string;
    sector?: string | null;
  } | null;
}

interface TableCustomGeneratorProps {
  contacts: Contact[];
}

const TableCustomGenerator: React.FC<TableCustomGeneratorProps> = ({ contacts }) => {

  const formatSector = (sector?: string | null) => {
  if (!sector) return "N/A";
  return sector
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const getFullName = (contact: Contact) =>
  `${contact.firstName} ${contact.lastName}`;

  return (
    <Table className="min-w-full border-collapse">
      <TableHeader className="bg-gray-900 text-white font-semibold">
        <TableRow>
          <TableHead className="py-4 px-6 text-left text-white">Name</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Sector</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Contact</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Job Title</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Email</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Phone 1</TableHead>
          <TableHead className="py-4 px-6 text-left text-white">Phone 2</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {contacts.map((contact, i) => (
          <TableRow key={i} className="border-b">
            <TableCell className="py-4 px-6 text-left text-xs">
              {contact.company?.name || "-"}
            </TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">
              {formatSector(contact.company?.sector) || "-"} 
            </TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">{getFullName(contact)}</TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">{contact.jobTitle}</TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">{contact.email}</TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">{contact.phone1 || "-"}</TableCell>
            <TableCell className="py-4 px-6 text-left text-xs">{contact.phone2 || "-"}</TableCell>            
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableCustomGenerator;