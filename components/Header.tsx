// Ward Name + current date
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/meetings/current", label: "Current Meeting" },
  { href: "/meetings", label: "Meetings" },
];

export default function NavLinks() {
    const pathname = usePathname();
    const today = new Date().toDateString();

    return (
        <div className="text-center py-2">
            <section>
            <h1 className="text-4xl text-tertiary text-center py-2 font-bold mb-4">Ward Name</h1>
        <p className="text-xl text-tertiary font-light italic">
          {today}
        </p>
      </section>
    <ul className="flex gap-6 text-lg font-normal text-tertiary">
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`transition-colors hover:text-primary hover:decoration-primary ${
                isActive ? "underline decoration-tertiary underline-offset-4 decoration-3" : "text-tertiary"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
            </ul>
            </div>
  );
}
