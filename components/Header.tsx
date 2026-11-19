// Ward Name + current date
import NavLinks from "@/components/NavLinks";
import { connection } from "next/server";

export default async function Header() {
  await connection();
  const today = new Date().toDateString();

  return (
    <header className="text-center py-2">
      <section>
        <h1 className="sm:text-4xl text-3xl text-tertiary text-center pt-2 font-bold mb-2 font-heading">
          Ward Name
        </h1>
        <p className="text-lg sm:text-xl text-secondary font-normal italic">
          {today}
        </p>
      </section>
      <div className="mt-4">
        <NavLinks />
      </div>
    </header>
  );
}
