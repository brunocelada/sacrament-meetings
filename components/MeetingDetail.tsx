// full agenda detail view
import type { SacramentMeeting } from "@/lib/types";

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeZone: "UTC",
  }).format(new Date(`${meeting.date}T00:00:00Z`));

  return (
    <article className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow-sm md:p-8">
      {/* Meeting header */}
      <section className="mb-8 border-b border-gray-200 pb-6 text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-secondary">
          {meeting.meetingType} meeting
        </p>

        <h1 className="mb-2 text-2xl sm:text-3xl font-bold text-gray-900 font-heading">
          Sacrament Meeting
        </h1>

        <p className="text-gray-600 italic">{formattedDate}</p>
      </section>

      {/* Meeting leadership */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold uppercase text-gray-600">
            Presiding
          </h2>
          <p className="mt-1 text-lg text-gray-900">{meeting.presiding}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase text-gray-600">
            Conducting
          </h2>
          <p className="mt-1 text-lg text-gray-900">
            {meeting.conducting ?
              `${meeting.conducting}`
              : "Unknown"}
          </p>
        </div>
      </section>

      {/* Announcements */}
      <section className="mb-8">
        <h2
          className="mb-3 text-xl font-semibold text-gray-900
        underline underline-offset-3 decoration-1 decoration-tertiary/25"
        >
          Announcements
        </h2>

        {meeting.announcements?.length ? (
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            {meeting.announcements.map((announcement, index) => (
              <li key={index}>{announcement}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No announcements</p>
        )}
      </section>

      {/* Opening hymn and prayer */}
      <section className="mb-8">
        <h2
          className="mb-3 text-xl font-semibold text-gray-900
        underline underline-offset-3 decoration-1 decoration-tertiary/25"
        >
          Opening
        </h2>

        <div className="space-y-3">
          <p className="text-gray-700">
            <span className="font-semibold">Opening Hymn: </span>
            {meeting.openingHymn ?
              `(#${meeting.openingHymn.number}) ${meeting.openingHymn.title}`
              : "No hymn"}
          </p>

          <p className="text-gray-700">
            <span className="font-semibold">Opening Prayer:</span>{" "}
            {meeting.openingPrayer ?
              `${meeting.openingPrayer}`
              : "Unknown"}
          </p>
        </div>
      </section>

      {/* Ward business */}
      <section className="mb-8">
        <h2
          className="underline underline-offset-3 decoration-1 decoration-tertiary/25
        mb-3 text-xl font-semibold text-gray-900"
        >
          Ward and Stake Business
        </h2>

        {meeting.wardBusiness.length > 0 ? (
          <ul className="list-disc space-y-2 pl-5 text-gray-700">
            {meeting.wardBusiness.map((item, index) => (
              <li key={index}>{item.description}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No ward business</p>
        )}

        <p className="mt-3 text-sm text-gray-600">
          Stake Business:{" "}
          <span className="font-bold">
            {meeting.stakeBusiness ? "Yes" : "No"}
          </span>
        </p>
      </section>

      {/* Sacrament hymn */}
      <section className="mb-8">
        <h2
          className="underline underline-offset-3 decoration-1 decoration-tertiary/25
        mb-3 text-xl font-semibold text-gray-900"
        >
          The Sacrament
        </h2>

        <p className="text-gray-700">
          <span className="font-semibold">Sacrament Hymn: </span>
          {meeting.sacramentHymn ?
              `(#${meeting.sacramentHymn.number}) ${meeting.sacramentHymn.title}`
              : "No hymn"}
        </p>
      </section>

      {/* Speakers and musical numbers */}
      <section className="mb-8">
        <h2
          className="underline underline-offset-3 decoration-1 decoration-tertiary/25
        mb-3 text-xl font-semibold text-gray-900"
        >
          Speakers and Musical Numbers
        </h2>

        {meeting.speakers.length > 0 ? (
          <ul className="space-y-4">
            {meeting.speakers.map((item, index) => (
              <li
                key={`${item.name}-${index}`}
                className="border-l-2 border-secondary2 pl-4"
              >
                <p className="font-semibold text-gray-900">{item.name}</p>

                <p className="text-sm text-gray-600">
                  {item.type === "speaker" ? "Speaker" : "Musical Number"}
                </p>

                {item.topic && (
                  <p className="mt-1 text-gray-700">{item.topic}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No speakers or musical numbers</p>
        )}
      </section>

      {/* Closing hymn and prayer */}
      <section className="border-t border-gray-200 pt-6">
        <h2
          className="underline underline-offset-3 decoration-1 decoration-tertiary/25
        mb-3 text-xl font-semibold text-gray-900"
        >
          Closing
        </h2>

        <div className="space-y-3">
          <p className="text-gray-700">
            <span className="font-semibold">Closing Hymn: </span>
            {meeting.closingHymn ?
              `(#${meeting.closingHymn.number}) ${meeting.closingHymn.title}`
              : "No hymn"}
          </p>

          <p className="text-gray-700">
            <span className="font-semibold">Closing Prayer:</span>{" "}
            {meeting.closingPrayer ?
              `${meeting.closingPrayer}`
              : "Unknown"}
          </p>
        </div>
      </section>
    </article>
  );
}
