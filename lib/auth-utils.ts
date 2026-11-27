import "server-only";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { canManageMeetings } from "@/lib/permissions";

export async function requireMeetingManager() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!canManageMeetings(session.user.role)) {
    redirect("/meetings");
  }

  return session.user;
}
