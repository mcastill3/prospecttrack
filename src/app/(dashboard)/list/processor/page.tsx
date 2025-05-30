import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GeneratorCard } from "@/components/Cards/GeneratorCard";
import { Info } from "lucide-react";

const FileProcessorPage = async () => {
  

  const data: {
    title: string;
    description: string;
    href: string;
    icon: "Users" | "Clock" | "FileText" | "Building2" | "Euro" | "Earth" | "Map" | "Settings" | "ArchiveRestore" | "CpuIcon" | "DatabaseBackupIcon";
  }[] = [
    
    {
      title: "Transforming File",
      icon: "CpuIcon",
      description: "Process the input file",
      href: "/list/processor/parse-file",
    },
    {
      title: "Verify File",
      icon: "ArchiveRestore",
      description: "Check input file compliance",
      href: "/list/processor/check-file",
    },    
    {
      title: "DB Insertion",
      icon: "DatabaseBackupIcon",
      description: "Inserting in DB",
      href: "/list/processor/insertion-db",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Files Processor</h1>
          <p className="text-gray-500">Review & Process inputs files</p>
        </div>
        <Button asChild variant={"outline"}>
          <Link href={"/list/processor"}>Back to generator</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <GeneratorCard
            key={item.title}
            title={item.title}
            description={item.description}
            href={item.href}
            icon={item.icon}
          />
        ))}
      </div> 
      <div className="mt-10 rounded-lg shadow border border-gray-200">
        {/* Sección de encabezado principal */}
        <div className="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-300">
          <h2 className="text-lg font-semibold text-gray-700">Information</h2>
        </div>

        {/* Contenido informativo */}
        <div className="bg-white p-4 rounded-b-lg text-gray-700 text-sm leading-relaxed">
          <div className="flex items-center mb-2">
            <Info className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-md font-semibold text-gray-800">Transforming File</h3>
          </div>
          <p>
            This option allows you to upload an Excel file and convert its contents to a format compatible with the database. The system normalizes the data according to the schema requirements, ensuring that all fields are correctly structured for further processing or import. It is ideal for standardizing information from external sources before integrating it into the system.
          </p>
        </div>
        <div className="bg-white p-4 rounded-b-lg text-gray-700 text-sm leading-relaxed">
          <div className="flex items-center mb-2">
            <Info className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-md font-semibold text-gray-800">Verifying File</h3>
          </div>
          <p>
            This step performs a secondary validation of the normalized Excel file to ensure full compliance with the database requirements. It checks for missing fields, incorrect data types, and structural inconsistencies. This verification guarantees that the file is clean, complete, and ready for import, minimizing the risk of errors during integration.
          </p>
        </div>
        <div className="bg-white p-4 rounded-b-lg text-gray-700 text-sm leading-relaxed">
          <div className="flex items-center mb-2">
            <Info className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-md font-semibold text-gray-800">DB Insertion</h3>
          </div>
          <p>
            This functionality takes the normalized and verified file and inserts its data directly into the database tables. It ensures that all entries are recorded accurately, preserving data integrity and aligning with the predefined schema. This final step completes the data integration process, making the information immediately available for system use.
          </p>
        </div>
      </div>

    </div>
  );
};

export default FileProcessorPage;