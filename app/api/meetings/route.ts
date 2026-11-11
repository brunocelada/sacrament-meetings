// GET /api/meetings (POST is optional stretch)
import { getMeetings } from "@/lib/meetings-db";
import { NextResponse } from "next/server";

export async function GET() {
  const meetings = await getMeetings();
  return NextResponse.json(meetings);
}

// export async function GET(request: Request) {
//   const date = new URL(request.url).searchParams.get("date");
//   const meetings = getMeetings(date);
//   return Response.json(meetings);
// }
