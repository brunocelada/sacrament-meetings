// GET /api/meetings (POST is optional stretch)
import { getMeetings } from "@/lib/meetings-db";
import { NextResponse } from "next/server";

function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsedDate = new Date(`${date}T00:00:00Z`);

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === date
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  // Validate the right Date format
  if (date !== null && !isValidDate(date)) {
    return NextResponse.json(
      { error: "Invalid date. Expected format: YYYY-MM-DD" },
      { status: 400 },
    );
  }

  const meetings = await getMeetings("", 1, date ?? undefined);

  // If the date is valid, but there are no meetings that day
  //   if (date && meetings.length === 0) {
  //   return NextResponse.json(
  //     { message: "No meetings found for this date" },
  //     { status: 404 },
  //   );
  // }

  return NextResponse.json(meetings);
}
