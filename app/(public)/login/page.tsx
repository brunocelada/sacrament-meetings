import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Sacrament Meetings
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to manage sacrament meetings.
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
