'use server';

import prisma from '@/lib/prisma';

export async function deleteAccount(companyId: string) {
  try {
    

    // 1. Eliminar el contacto
    await prisma.company.delete({
      where: { id: companyId },
    });

    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting the account:', error);
    return { success: false, error: 'Failed to delete the account' };
  }
}
