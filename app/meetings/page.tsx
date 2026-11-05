// all meetings list
import MeetingCard from "@/components/MeetingCard";
import { headers } from "next/headers";
import type { SacramentMeeting } from "@/lib/types";

export const instant = false;

export default async function MeetingsPage() {
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  if (!host) {
    throw new Error("Unable to determine the request host");
  }

  const response = await fetch(`${protocol}://${host}/api/meetings`, {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch meetings");
  }

  const meetings: SacramentMeeting[] = await response.json();

  return (
    <main className="items-center flex flex-col mx-auto max-w-5xl px-4 py-2">
      <h1 className="mb-6 text-3xl font-bold text-tertiary font-heading">
        Sacrament Meetings
      </h1>
      <div>
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </main>
  );
}
