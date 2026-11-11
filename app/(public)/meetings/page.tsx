// all meetings list
import MeetingCard from "@/components/MeetingCard";
import { getMeetings } from "@/lib/meetings-db";

export const instant = false;

export default async function MeetingsPage() {
  const meetings = await getMeetings();

  return (
    <main className="items-center flex flex-col mx-auto max-w-5xl px-4 py-2">
      <h1 className="mb-2 sm:mb-6 text-2xl sm:text-3xl font-bold text-tertiary font-heading">
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
