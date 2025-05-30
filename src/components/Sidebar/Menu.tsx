import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { faBuilding, faAddressBook, faCalendar, faComments, faHandshake, faChartBar, faIdBadge, faPaperPlane, faMoneyBill1, faClipboard, faLightbulb, faCirclePlay, faCircle, faBookmark, faFlag, faPenToSquare, faFileLines, faFolder, faObjectGroup } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const menuItems = [
    {
      title: "DIRECCIÓN COMERCIAL",
      allowedRoles: ["admin", "comercial","director_comercial", "director_marketing"],
      items: [
        {
          icon: faChartBar,
          label: "Dashboard",
          href: "/director_comercial",
          visible: ["admin", "director_comercial"],
        },
        {
          icon: faCalendar,
          label: "Calendar",
          href: "/director_comercial/calendar",
          visible: ["admin", "director_comercial"],
        },
        {
          icon: faPaperPlane,
          label: "Activities",
          href: "/list/campaign",
          visible: ["admin", "director_comercial"],
        },
        {
          icon: faPenToSquare,
          label: "Leads",
          href: "/list/lead",
          visible: ["admin", "director_comercial"],
        },
        
        {
          icon: faBuilding,
          label: "Accounts",
          href: "/list/organizations",
          visible: ["admin", "comercial", "director_comercial"],
        },
        {
          icon: faAddressBook,
          label: "Contacts",
          href: "/list/contact",
          visible: ["admin", "comercial", "director_comercial"],
        },
        {
          icon: faFileLines,
          label: "Reports",
          href: "/list/contact",
          visible: ["admin", "comercial", "director_comercial"],
        },
      ],
    },
    {
      title: "DIRECCIÓN MARKETING",
      allowedRoles: ["admin", "comercial", "director_marketing"],
      items: [
        {
          icon: faChartBar,
          label: "Dashboard",
          href: "/director_marketing",
          visible: ["admin", "director_marketing"],
        },
        {
          icon: faCalendar,
          label: "Calendar",
          href: "/director_marketing/calendar",
          visible: ["admin", "director_marketing"],
        },
        {
          icon: faPaperPlane,
          label: "Activities",
          href: "/list/campaign",
          visible: ["admin", "director_marketing"],
        },
        {
          icon: faPenToSquare,
          label: "Leads",
          href: "/list/lead",
          visible: ["admin", "director_marketing"],
        },
        
        {
          icon: faBuilding,
          label: "Accounts",
          href: "/list/organizations",
          visible: ["admin", "director_marketing"],
        },
        {
          icon: faAddressBook,
          label: "Contacts",
          href: "/list/contact",
          visible: ["admin", "director_marketing"],
        },
        {
          icon: faBookmark,
          label: "Tracking",
          href: "/list/track",
          visible: ["admin", "director_marketing"],
        },        
        {
          icon: faFolder,
          label: "Files Processor",
          href: "/list/processor",
          visible: ["admin", "director_marketing"],
        },
        {
          icon: faObjectGroup,
          label: "Generate Lists",
          href: "/list/generator",
          visible: ["admin", "director_marketing"],
        },
        {
          icon: faFileLines,
          label: "Reports",
          href: "/reporting",
          visible: ["admin", "director_marketing"],
        },        
      ],
    },
    {
      title: "MARKETING",
      allowedRoles: ["admin", "analista_marketing"],
      items: [
        {
          icon: faChartBar,
          label: "Dashboard",
          href: "/analista_marketing",
          visible: ["admin", "analista_marketing"],
        },
        {
          icon: faCalendar,
          label: "Calendar",
          href: "/analista_marketing/calendar",
          visible: ["admin", "analista_marketing"],
        },
        {
          icon: faPaperPlane,
          label: "Activities",
          href: "/list/campaign",
          visible: ["admin", "analista_marketing"],
        },
        
        {
          icon: faBuilding,
          label: "Accounts",
          href: "/list/organizations",
          visible: ["admin", "analista_marketing"],
        },
        {
          icon: faHandshake,
          label: "Partners",
          href: "/list/partner",
          visible: ["admin", "analista_marketing"],
        },
        {
          icon: faAddressBook,
          label: "Contacts",
          href: "/list/contact",
          visible: ["admin", "analista_marketing"],
        },
        {
          icon: faBookmark,
          label: "Tracking",
          href: "/list/lead",
          visible: ["admin", "analista_marketing"],
        },
        {
          icon: faLightbulb,
          label: "Tasks",
          href: "/list/tasks",
          visible: ["admin", "analista_marketing"],
        },
        {
          icon: faFlag,
          label: "Strategies",
          href: "/list/strategies",
          visible: ["admin", "analista_marketing"],
        },
      ],
    },
    {
      title: "DIGITAL SALES",
      allowedRoles: ["admin", "digital_sales"],
      items: [
        {
          icon: faChartBar,
          label: "Dashboard",
          href: "/digital_sales",
          visible: ["admin", "digital_sales"],
        },
        {
          icon: faCalendar,
          label: "Calendar",
          href: "/digital_sales/calendar",
          visible: ["admin", "digital_sales"],
        },
        {
          icon: faPaperPlane,
          label: "Activities",
          href: "/list/campaign",
          visible: ["admin", "digital_sales"],
        },
        {
          icon: faPenToSquare,
          label: "Leads",
          href: "/list/lead",
          visible: ["admin", "digital_sales"],
        },
        
        {
          icon: faBuilding,
          label: "Accounts",
          href: "/list/organizations",
          visible: ["admin", "digital_sales"],
        },
        
        {
          icon: faAddressBook,
          label: "Contacts",
          href: "/list/contact",
          visible: ["admin", "digital_sales"],
        },
        {
          icon: faBookmark,
          label: "Tracking",
          href: "/list/track",
          visible: ["admin", "digital_sales"],
        },        
        {
          icon: faFolder,
          label: "Files Processor",
          href: "/list/processor",
          visible: ["admin", "digital_sales"],
        },
        {
          icon: faObjectGroup,
          label: "Generate Lists",
          href: "/list/generator",
          visible: ["admin", "digital_sales"],
        },
        {
          icon: faFileLines,
          label: "Reports",
          href: "/reporting",
          visible: ["admin", "digital_sales"],
        },
      ],
    }  
];

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;


  return (
    <div className="space-y-1">
      {menuItems.map((section) => {
        if (!section.allowedRoles.includes(role)) return null;
        const visibleItems = section.items.filter(item => item.visible.includes(role));
        if (visibleItems.length === 0) return null;

        return (
          <div className="flex flex-col gap-2" key={section.title}>
            <span className="hidden lg:block text-gray-400 font-semibold my-4">
              {section.title}
            </span>
            {visibleItems.map((item) => (
              <Link
              href={item.href}
              key={item.label}
              className="group flex items-center justify-center lg:justify-start gap-4 text-[#7C7D85] py-2 md:px-2 rounded-md hover:bg-[#F4F4F5]"
            >
              {typeof item.icon === "string" ? (
                <Image
                  src={item.icon}
                  alt=""
                  width={20}
                  height={20}
                  className="group-hover:filter group-hover:brightness-0 group-hover:hue-rotate-270 group-hover:saturate-200"
                />
              ) : (
                <FontAwesomeIcon
                  icon={item.icon as any} 
                  className="w-5 h-5 text-[#7C7D85] group-hover:text-[#8E4AFC]"
                />
              )}
              <span className="hidden lg:block text-[#7C7D85] group-hover:text-black">
                {item.label}
              </span>
            </Link>           
            
            ))}
          </div>
        );
      })}
    </div>    
  );
}

export default Menu;