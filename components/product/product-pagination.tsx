"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { buildPaginationItems } from "@/lib/pagination";

function pageHref(
  pathname: string,
  searchParams: URLSearchParams,
  page: number
) {
  const params = new URLSearchParams(searchParams.toString());
  if (page <= 1) params.delete("page");
  else params.set("page", String(page));
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

const controlClass =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border border-border bg-white px-3 text-sm font-medium text-ink shadow-sm transition-colors hover:border-brand/40 hover:text-brand disabled:pointer-events-none disabled:opacity-40";

export function ProductPagination({
  page,
  totalPages,
  className,
}: {
  page: number;
  totalPages: number;
  className?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const items = buildPaginationItems(page, totalPages);
  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  return (
    <nav
      className={cn("flex flex-wrap items-center justify-center gap-1.5", className)}
      aria-label="Product pages"
    >
      {page <= 1 ? (
        <span className={cn(controlClass, "opacity-40")} aria-disabled>
          Prev
        </span>
      ) : (
        <Link
          href={pageHref(pathname, searchParams, prevPage)}
          className={controlClass}
          prefetch
          aria-label="Previous page"
        >
          Prev
        </Link>
      )}

      {items.map((item) =>
        item.type === "ellipsis" ? (
          <span
            key={`e-${item.id}`}
            className="inline-flex h-9 min-w-9 items-center justify-center px-1 text-sm text-ink-muted"
            aria-hidden
          >
            …
          </span>
        ) : (
          <Link
            key={item.page}
            href={pageHref(pathname, searchParams, item.page)}
            prefetch
            aria-label={`Page ${item.page}`}
            aria-current={item.page === page ? "page" : undefined}
            className={cn(
              controlClass,
              "min-w-9 px-0",
              item.page === page &&
                "border-brand bg-brand text-white shadow-sm hover:border-brand hover:bg-brand-hover hover:text-white"
            )}
          >
            {item.page}
          </Link>
        )
      )}

      {page >= totalPages ? (
        <span className={cn(controlClass, "opacity-40")} aria-disabled>
          Next
        </span>
      ) : (
        <Link
          href={pageHref(pathname, searchParams, nextPage)}
          className={controlClass}
          prefetch
          aria-label="Next page"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
