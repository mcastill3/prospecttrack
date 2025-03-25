import Navbar from "@/components/Navbar/Navbar";
import AccountToggle from "@/components/Sidebar/AccountToggle";
import Menu from "@/components/Sidebar/Menu";

export default function DashboarLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="flex-[0.14] p-4 bg-white shadow-md">
        <AccountToggle />
        <Menu />
      </div>

      {/* RIGHT */}
      <div className="flex-1 flex flex-col bg-gray-100 overflow-hidden">
        <Navbar />
        <div className="flex-1 overflow-auto p-4 bg-gray-200 mb-2">{children}</div>
      </div>
    </div>
  );
}
 