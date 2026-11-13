import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meetings",
  description: "Sacrament Meetings agenda",
};

export default function MeetingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={<div className="center py-4 mt-12 text-center">Loading...</div>}
    >
      <div>{children}</div>
    </Suspense>
  );
}
