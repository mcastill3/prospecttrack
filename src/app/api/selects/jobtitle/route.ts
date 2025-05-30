import { NextResponse } from "next/server";

const jobTitles = [
  "CEO",
  "CIO",
  "CFO",
  "CTO",
  "CISO",
  "COO",
  "ARCHITECT",
  "STO",
  "IT_MANAGEMENT",
  "INFORMATION_SECURITY",
  "INFRAESTRUCTURE",
  "OTHER",
];

export async function GET() {
  return NextResponse.json(jobTitles, {
    headers: {
      'Cache-Control': 'public, max-age=3600', // 1 hora
    },
  });
}