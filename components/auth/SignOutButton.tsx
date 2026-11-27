import { logout } from "@/lib/auth-actions";

export default function SignOutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-800"
      >
        Sign out
      </button>
    </form>
  );
}
