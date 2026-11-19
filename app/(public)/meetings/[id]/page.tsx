// single meeting detail + print mode
import MeetingDetail from "@/components/MeetingDetail";
import { getMeetingById } from "@/lib/meetings-db";
import { notFound } from "next/navigation";

export const instant = false;

interface MeetingPageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { id } = await params;
  const meeting = await getMeetingById(Number(id));

  if (!meeting) {
    notFound();
  }

  return (
    <main className="px-4 py-2">
      <MeetingDetail meeting={meeting} />
    </main>
  );
}
