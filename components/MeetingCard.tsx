// summary card for list view
import Link from "next/link";
import type { SacramentMeeting } from "@/lib/types";

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

const meetingTypeLabels: Record<SacramentMeeting["meetingType"], string> = {
  testimony: "Testimony Meeting",
  regular: "Regular Meeting",
  stake: "Stake Meeting",
  general: "General Meeting",
};

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${meeting.date}T00:00:00Z`));

  return (
    <article
      className="rounded-lg border border-gray-200 my-2 
    bg-white p-4 shadow-sm transition-shadow hover:shadow-md
    w-full max-w-[300px] sm:max-w-[600px] mx-auto sm:p-6
    "
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="mb-3 text-md sm:text-xl  font-bold text-secondary font-heading">
          {meetingTypeLabels[meeting.meetingType]}
        </span>

        <span className="text-sm sm:text-md italic text-gray-700">
          {formattedDate}
        </span>
      </div>

      <div className="text-sm sm:text-md space-y-2 text-gray-600">
        <p>
          <span className="font-semibold text-gray-800">Presiding:</span>{" "}
          {meeting.presiding}
        </p>

        <p>
          <span className="font-semibold text-gray-800">Conducting:</span>{" "}
          {meeting.conducting}
        </p>

        <div className="flex gap-4 text-gray-800">
          <p>
            <span className="font-semibold">Opening:</span>{" "}
            {meeting.openingHymn ? `#${meeting.openingHymn.number}` : "No hymn"}
          </p>

          <p>
            <span className="font-semibold">Sacramental:</span>{" "}
            {meeting.sacramentHymn
              ? `#${meeting.sacramentHymn.number}`
              : "No hymn"}
          </p>

          <p>
            <span className="font-semibold">Closing:</span>{" "}
            {meeting.closingHymn ? `#${meeting.closingHymn.number}` : "No hymn"}
          </p>
        </div>

        <p>
          <span className="font-semibold text-gray-800">Speakers:</span>{" "}
          {meeting.speakers.filter((item) => item.type === "speaker").length}
        </p>
      </div>

      <Link
        href={`/meetings/${meeting.id}`}
        className="mt-5 inline-block rounded-md bg-secondary px-4 py-2 text-sm 
        font-medium text-white transition-colors hover:bg-primary focus-visible:outline-2 
        focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        View Meeting Details
      </Link>
    </article>
  );
}
