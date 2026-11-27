import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { canManageMeetings } from "@/lib/permissions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!canManageMeetings(session.user.role)) {
    redirect("/meetings");
  }

  return <>{children}</>;
}
