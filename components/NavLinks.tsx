// active-link navigation
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

  return (
    <nav>
      <ul className="flex justify-center gap-6 text-md sm:text-xl font-medium text-tertiary">
        {links.map((link) => {
          const isActive = pathname === link.href;

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
