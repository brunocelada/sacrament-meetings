// single meeting detail + print mode
import MeetingDetail from "@/components/MeetingDetail";
import { getMeetingById } from "@/lib/meetings-db";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import type { Metadata, ResolvingMetadata } from "next";
import { cache } from "react";

export const instant = false;

const getCachedMeetingById = cache(getMeetingById);

interface MeetingPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: MeetingPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  const meeting = await getCachedMeetingById(id);

  if (!meeting) {
    notFound();
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeZone: "UTC",
  }).format(new Date(`${meeting.date}T00:00:00Z`));

  const meetingType =
    meeting.meetingType.charAt(0).toUpperCase() + meeting.meetingType.slice(1);

  const title = `${meetingType} Meeting – ${formattedDate}`;

  const description = `View the agenda for the ${meetingType.toLowerCase()} sacrament meeting on ${formattedDate}, including meeting leadership, hymns, prayers, speakers, and ward business.`;

  const inheritedImages = (await parent).openGraph?.images ?? [];

  return {
    title,
    description,
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Sacrament Meetings",
      title,
      description,
      images: inheritedImages,
    },
  };
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  const meeting = await getCachedMeetingById(id);

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
