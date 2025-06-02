'use server';

import prisma from '@/lib/prisma';

export async function deleteAccountManager(accountManagerId: string) {
  try {
    // Eliminar el Account Manager por su ID
    await prisma.accountManager.delete({
      where: { id: accountManagerId },
    });

    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting the Account Manager:', error);
    return { success: false, error: 'Failed to delete the Account Manager' };
  }
}

