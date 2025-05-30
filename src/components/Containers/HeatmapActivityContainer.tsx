import prisma from "@/lib/prisma";
import HeatmapActivityChart from "../Charts/HeatmapActivityChart";


const HeatmapActivityContainer = async () => {
  try {
    const activities = await prisma.activity.findMany({
      select: {
        type: true,
        leads: {
          select: { id: true },
        },
      },
    });

    const grouped = activities.reduce((acc, activity) => {
      const type = activity.type;
      acc[type] = (acc[type] || 0) + activity.leads.length;
      return acc;
    }, {} as Record<string, number>);

    const leadCountsByActivityType: Record<string, number> = Object.entries(grouped).reduce(
        (acc, [type, count]) => {
            acc[type] = count;
            return acc;
        },
        {} as Record<string, number>
    );

    return (
      <div className="bg-white rounded-xl w-full h-[420px] p-6 shadow-lg">
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <h1 className="text-xl font-semibold text-gray-700">
          Leads Count by Activity Type
        </h1>
      </div>
      <div className="flex justify-center">
        <HeatmapActivityChart data={leadCountsByActivityType} />
      </div>
    </div>
    )
  } finally {
    await prisma.$disconnect(); // 🔒 Cerramos conexión
  }
};

export default HeatmapActivityContainer;
