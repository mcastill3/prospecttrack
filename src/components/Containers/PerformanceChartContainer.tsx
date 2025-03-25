import prisma from "@/lib/prisma";
import PerformanceChart from "../Charts/PerformanceChart";

const monthlyGoal = 10; // Meta de leads por mes

const PerformanceChartContainer = async ({ playerId }: { playerId: string }) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const leadsCount = await prisma.lead.count({
    where: {
      players: { some: { id: playerId } },
      createdAt: { gte: startOfMonth },
    },
  });

  return <PerformanceChart leadsCount={leadsCount} monthlyGoal={monthlyGoal} />;
};

export default PerformanceChartContainer;
