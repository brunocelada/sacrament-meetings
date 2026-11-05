// single meeting detail + print mode
import MeetingDetail from "@/components/MeetingDetail";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { SacramentMeeting } from "@/lib/types";

export const instant = false;

interface MeetingPageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetingPage({ params }: MeetingPageProps) {
  const { id } = await params;

  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") ?? headersList.get("host");

  const protocol = headersList.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Unable to determine the request host");
  }
  const response = await fetch(`${protocol}://${host}/api/meetings/${id}`, {
    cache: "no-store",
  });
  if (response.status === 404 || response.status === 400) {
    notFound();
  }
  if (!response.ok) {
    throw new Error("Failed to fetch meeting");
  }

  const meeting: SacramentMeeting = await response.json();

  return (
    <main className="px-4 py-2">
      <MeetingDetail meeting={meeting} />
    </main>
  );
}
