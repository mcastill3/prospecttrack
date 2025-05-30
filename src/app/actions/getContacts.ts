// /app/actions/getContacts.ts
import  prisma  from '@/lib/prisma';

export async function getContacts() {
  const contacts = await prisma.contact.findMany({
    include: {
      company: true,
      city: true,
      country: true,
    },
  });

  // Opcional: hacer transformaciones si hace falta (por ejemplo, limpiar nulls o mapear sectores)
  return contacts;
}
