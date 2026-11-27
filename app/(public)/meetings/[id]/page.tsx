// single meeting detail + print mode
import MeetingDetail from "@/components/MeetingDetail";
import { getMeetingById } from "@/lib/meetings-db";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export const instant = false;

interface MeetingPageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  const meeting = await getMeetingById(id);

  if (!meeting) {
    notFound();
  }

  const session = await auth();
  const isAdmin = session?.user?.role === "admin";

  return (
    <main className="px-4 py-2">
      <MeetingDetail meeting={meeting} isAdmin={isAdmin} />
    </main>
  );
}
