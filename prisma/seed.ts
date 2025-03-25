import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear dos empresas (Company)
  await prisma.company.createMany({
    data: [
      {
        name: 'Acme Corp',
        industry: 'Technology',
        size: 500,
        country: 'Spain',
        city: 'Madrid',
      },
      {
        name: 'Tech Innovators',
        industry: 'Software',
        size: 200,
        country: 'USA',
        city: 'San Francisco',
      },
    ],
    skipDuplicates: true, // Evitar duplicados si el nombre ya existe
  })

  // Crear dos partners (Partner)
  await prisma.partner.createMany({
    data: [
      {
        name: 'Global Solutions',
        country: 'Canada',
        city: 'Toronto',
        industry: 'Consulting',
      },
      {
        name: 'Digital Partners',
        country: 'Germany',
        city: 'Berlin',
        industry: 'Marketing',
      },
    ],
    skipDuplicates: true, // Evitar duplicados si el nombre ya existe
  })

  // Crear cuatro contactos (Contact)
  await prisma.contact.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '123-456-7890',
        companyId: 'fe2e0015-399d-496c-aa89-f4a3f254930d',  // Usa la ID real de la empresa
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '234-567-8901',
        companyId: '4e7afb1b-8bea-431c-ba92-a85aaf91c475',  // Usa la ID real de la empresa
      },
      {
        name: 'Sam Wilson',
        email: 'sam.wilson@example.com',
        phone: '345-678-9012',
        partnerId: '9aeb3da8-d9c7-40c6-8ff3-bf19d2b76b27',  // Usa la ID real del partner
      },
      {
        name: 'Laura Brown',
        email: 'laura.brown@example.com',
        phone: '456-789-0123',
        partnerId: 'fe2e0015-399d-496c-aa89-f4a3f254930d',  // Usa la ID real del partner
      },
    ],
    skipDuplicates: true, // Evitar duplicados si el email ya existe
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
