'use server';

import prisma from '@/lib/prisma';

export async function deleteContact(contactId: string) {
  try {
    

    // 1. Eliminar el contacto
    await prisma.contact.delete({
      where: { id: contactId },
    });

    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting contact:', error);
    return { success: false, error: 'Failed to delete contact' };
  }
}
