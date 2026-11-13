// all meetings list
import MeetingCard from "@/components/MeetingCard";
import { MeetingSearch } from "@/components/MeetingSearch";
import { Pagination } from "@/components/Pagination";
import { getMeetings, getMeetingsTotalPages } from "@/lib/meetings-db";

export const instant = false;

interface MeetingsPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}

export default async function MeetingsPage({
  searchParams,
}: MeetingsPageProps) {
  const params = await searchParams;
  const query = params.query ?? "";
  const currentPage = Number(params.page) || 1;

  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, currentPage),
    getMeetingsTotalPages(query),
  ]);

  return (
    <main className="items-center flex flex-col mx-auto max-w-5xl px-4 py-2">
      <h1 className="mb-2 sm:mb-6 text-2xl sm:text-3xl font-bold text-tertiary font-heading">
        Sacrament Meetings
      </h1>
      <div className="w-full">
        <MeetingSearch />

        <div className="mt-6">
          {meetings.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>

        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}
