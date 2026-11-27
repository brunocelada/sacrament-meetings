import MeetingCard from "@/components/MeetingCard";
import { MeetingSearch } from "@/components/MeetingSearch";
import { Pagination } from "@/components/Pagination";
import { getMeetings, getMeetingsTotalPages } from "@/lib/meetings-db";
import { auth } from "@/auth";
import type { Metadata } from "next";
import { canManageMeetings } from "@/lib/permissions";

export const instant = false;

export const metadata: Metadata = {
  title: "Meetings",
  description:
    "Browse sacrament meeting agendas for Parque Urquiza Ward, including schedules, hymns, prayers, speakers, and ward business.",
};

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

  const requestedPage = Number(params.page);

  const validPage =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const totalPages = await getMeetingsTotalPages(query);
  const currentPage = totalPages > 0 ? Math.min(validPage, totalPages) : 1;

  const meetings = await getMeetings(query, currentPage);

  const session = await auth();
  const canManage = canManageMeetings(session?.user?.role);

  return (
    <main className="items-center flex flex-col mx-auto max-w-5xl px-4 py-2">
      <h1 className="mb-2 sm:mb-6 text-2xl sm:text-3xl font-bold text-tertiary font-heading">
        Sacrament Meetings
      </h1>
      <div className="w-full">
        <MeetingSearch />

        <div className="mt-6">
          {meetings.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              canManageMeetings={canManage}
            />
          ))}
        </div>

        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </main>
  );
}
