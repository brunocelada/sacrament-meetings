import { redirect } from "next/navigation";
import { getAllMeetings } from "@/lib/meetings-db";
import { connection } from "next/server";

export const instant = false;

export default async function CurrentMeetingPage() {
  await connection();
  const today = new Date();
  const dayOfWeek = today.getDay();
  const sunday = new Date(today);
  sunday.setDate(today.getDate() + ((7 - dayOfWeek) % 7));

  const sundayDate = [
    sunday.getFullYear(),
    String(sunday.getMonth() + 1).padStart(2, "0"),
    String(sunday.getDate()).padStart(2, "0"),
  ].join("-");

  const meetings = await getAllMeetings(sundayDate);
  const meeting = meetings[0];

  if (!meeting) {
    redirect("/meetings");
  }
  redirect(`/meetings/${meeting.id}`);
}
