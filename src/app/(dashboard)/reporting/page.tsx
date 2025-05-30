import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReportCard } from "@/components/Cards/ReportCard";

const ReportingPage = async () => {
  

  const data: {
    title: string;
    description: string;
    href: string;
    icon: "Users" | "Clock" | "FileText";
  }[] = [
    {
      title: "Lead Generation",
      icon: "Users",
      description: "Download the Lead Generation report",
      href: "/api/reports/employees",
    },
    {
      title: "Activities Report",
      icon: "Clock",
      description: "Download a report of the activities",
      href: "/admin/reports/hours-report",
    },
    {
      title: "Accounts Report",
      icon: "FileText",
      description: "Download a report of all the accounts",
      href: "/admin/time-off-repuests",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-gray-500">Manage and download reports for your company</p>
        </div>
        <Button asChild variant={"outline"}>
          <Link href={"/admin"}>Back to dashboard</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <ReportCard
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

export default ReportingPage;