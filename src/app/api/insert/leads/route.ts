// app/api/insert/leads/route.ts
import { NextResponse } from "next/server";
import { createLead } from "@/lib/actions";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const lead = await createLead(data);
    return NextResponse.json(lead);
  } catch (error) {
    console.error("❌ Error en API createLead:", error);
    return NextResponse.json(
      { error: "Error creando lead" },
      { status: 500 }
    );
  }
}
