"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/meetings/current", label: "Current Meeting" },
  { href: "/meetings", label: "Meetings" },
  { href: "/meetings/new", label: "New Meeting" },
];

export default function NavLinks({
  canManageMeetings,
}: {
  canManageMeetings: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm sm:text-base font-medium text-tertiary">
        {links
          .filter((link) => link.href !== "/meetings/new" || canManageMeetings)
          .map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href === "/meetings" &&
                pathname.startsWith("/meetings/") &&
                !pathname.startsWith("/meetings/current") &&
                pathname !== "/meetings/new");

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-colors hover:text-primary hover:decoration-primary ${
                    isActive
                      ? "underline decoration-tertiary underline-offset-4 decoration-3"
                      : "text-tertiary"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
      </ul>
    </nav>
  );
}
