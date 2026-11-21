"use client";

import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Meetings section error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-bold text-primary">
        Something went wrong
      </h1>

      <p className="mt-4 max-w-md text-gray-600">
        An unexpected error occurred while processing your request.
        Please try again or return to the meetings page.
      </p>

      {error.digest && (
        <p className="mt-2 text-sm text-gray-400">
          Error reference: {error.digest}
        </p>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          Try Again
        </button>

        <Link
          href="/meetings"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          Back to Meetings
        </Link>
      </div>
    </main>
  );
}