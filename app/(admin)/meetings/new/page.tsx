import MeetingsForm from "@/components/MeetingsForm";
import { createMeeting } from "@/lib/actions";

export default function NewMeetingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-tertiary sm:text-3xl">
        Create Sacrament Meeting
      </h1>

      <MeetingsForm
        action={createMeeting}
        mode="create"
      />
    </main>
  );
}