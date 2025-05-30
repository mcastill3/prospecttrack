'use server';

import prisma from '@/lib/prisma';

export async function deleteActivity(activityId: string) {
  try {
    // 1. Eliminar relaciones con contactos (ActivityContact)
    await prisma.activityContact.deleteMany({
      where: { activityId },
    });

    // 2. Eliminar la actividad
    await prisma.activity.delete({
      where: { id: activityId },
    });

    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting activity:', error);
    return { success: false, error: 'Failed to delete activity' };
  }
}
