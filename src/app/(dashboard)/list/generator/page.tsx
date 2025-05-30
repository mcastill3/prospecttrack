import { Button } from "@/components/ui/button";
import Link from "next/link";
import { GeneratorCard } from "@/components/Cards/GeneratorCard";

const GeneratorListPage = async () => {
  

  const data: {
    title: string;
    description: string;
    href: string;
    icon: "Users" | "Clock" | "FileText" | "Building2" | "Euro" | "Earth" | "Map" | "Settings";
  }[] = [
    {
      title: "Sector",
      icon: "Building2",
      description: "Generate a list based on the companies sector",
      href: "/list/generator/sectorfilter",
    },
    {
      title: "Job Title",
      icon: "Users",
      description: "Generate a list based on the contacts Job Title",
      href: "/list/generator/jobtitlefilter",
    },
    {
      title: "Business size",
      icon: "Euro",
      description: "Generate a list based on the company type",
      href: "/list/generator/typefilter",
    },
    {
      title: "Country",
      icon: "Earth",
      description: "Generate a list based on the country of the company",
      href: "/list/generator/countryfilter",
    },
    {
      title: "City",
      icon: "Map",
      description: "Generate a list based on the city of the company",
      href: "/list/generator/cityfilter",
    },
    {
      title: "Customized",
      icon: "Settings",
      description: "Generate a list combining different parameters",
      href: "/list/generator/customfilter",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Lists Generator</h1>
          <p className="text-gray-500">Generate and download customized prospection lists</p>
        </div>
        <Button asChild variant={"outline"}>
          <Link href={"/list/generator"}>Back to generator</Link>
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
    </div>
  );
};

export default GeneratorListPage;