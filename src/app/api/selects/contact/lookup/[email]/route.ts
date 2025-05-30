// app/api/selects/contact/lookup/[email]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { email: string } }
) {
  const { email } = params;

  try {
    const contact = await prisma.contact.findUnique({
      where: { email },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        company: {
          select: { 
            id:true,
            name: true },
        },
        country: {
          select: { 
            id: true,
            name: true },
        },
        city: {
          select: { 
            id: true,
            name: true },
        },
      },
    });

    if (!contact) {
      return new NextResponse("Contact not found", { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error fetching contact:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
