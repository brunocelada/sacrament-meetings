import Link from "next/link";

export default function MeetingNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-primary">Meeting Not Found</h1>

      <p className="mt-4 max-w-md text-gray-600">
        The meeting you are looking for does not exist or may have been deleted.
      </p>

      <Link
        href="/meetings"
        className="mt-6 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
      >
        Back to Meetings
      </Link>
    </main>
  );
}
