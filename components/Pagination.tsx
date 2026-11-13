"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
}

export function Pagination({ totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  function createPageURL(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  }

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Meetings pagination"
      className="flex items-center justify-center gap-4 mt-6"
    >
      {currentPage > 1 ? (
        <Link
          href={createPageURL(currentPage - 1)}
          className="rounded-md border px-4 py-2 hover:bg-gray-100"
        >
          Previous
        </Link>
      ) : (
        <span className="rounded-md border px-4 py-2 text-gray-400">
          Previous
        </span>
      )}

      <span aria-current="page" className="font-semibold">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={createPageURL(currentPage + 1)}
          className="rounded-md border px-4 py-2 hover:bg-gray-100"
        >
          Next
        </Link>
      ) : (
        <span className="rounded-md border px-4 py-2 text-gray-400">Next</span>
      )}
    </nav>
  );
}
