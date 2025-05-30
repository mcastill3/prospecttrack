// TEMPORARY DATA

// export let role = "admin";
import prisma  from "@/lib/prisma";

export async function getActivities() {
  return await prisma.activity.findMany({
    select: {
      id: true,
      name: true,
      date: true, // <-- asumimos que el campo se llama "date"
    },
    orderBy: { date: "desc" },
  });
}
