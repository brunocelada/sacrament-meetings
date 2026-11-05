import { Suspense } from "react";

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
