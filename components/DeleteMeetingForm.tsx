import ConfirmationForm from "@/components/ConfirmationForm";
import { deleteMeeting } from "@/lib/actions";

interface DeleteMeetingFormProps {
  meetingId: number;
}

export default function DeleteMeetingForm({
  meetingId,
}: DeleteMeetingFormProps) {
  const deleteMeetingWithId = deleteMeeting.bind(null, meetingId);

  return (
    <ConfirmationForm
      action={deleteMeetingWithId}
      title="Delete Meeting?"
      message="Are you sure you want to delete this sacrament meeting? This action cannot be undone."
      submitLabel="Delete"
      confirmLabel="Yes, Delete"
      cancelLabel="Cancel"
      confirmClassName="bg-red-600 hover:bg-red-700 text-white"
      submitClassName="mt-5 inline-block rounded-md border border-red-600 px-4 py-0 text-xs
        font-medium text-red-600 transition-colors hover:bg-red-600 hover:text-white"
    />
  );
}
