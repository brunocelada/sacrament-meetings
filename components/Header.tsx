import NavLinks from "@/components/NavLinks";
import { connection } from "next/server";
import { auth } from "@/auth";
import SignOutButton from "@/components/auth/SignOutButton";
import Link from "next/link";
import { canManageMeetings as canManageMeetingsRole } from "@/lib/permissions";

export default async function Header() {
  await connection();
  const today = new Date().toDateString();

  const session = await auth();
  const canManage = canManageMeetingsRole(session?.user?.role);

  return (
    <header className="text-center py-2">
      <div className="mx-auto flex w-full max-w-6xl justify-end px-4 py-2">
        {session?.user ? (
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <div className="min-w-0 text-right">
              <p className="truncate text-sm font-semibold text-gray-800">
                {session.user.name ?? session.user.email ?? "Account"}
              </p>

              <p className="text-xs font-medium uppercase tracking-wide text-secondary">
                {session.user.role === "admin"
                  ? "Admin"
                  : session.user.role === "tester"
                    ? "Tester"
                    : "User"}
              </p>
            </div>

            <SignOutButton />
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-secondary px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Sign in
          </Link>
        )}
      </div>

      <section>
        <h1 className="sm:text-4xl text-3xl text-tertiary text-center pt-2 font-bold mb-2 font-heading">
          Parque Urquiza Ward
        </h1>
        <p className="text-lg sm:text-xl text-secondary font-normal italic">
          {today}
        </p>
      </section>
      <div className="mt-4">
        <NavLinks canManageMeetings={canManage} />
      </div>
    </header>
  );
}
