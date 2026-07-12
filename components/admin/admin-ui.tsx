import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "admin-page-header sticky z-40 mb-4 flex flex-col gap-2.5",
        // Opaque match to shell + mobile chrome so rows never ghost through
        "border-b border-border bg-[#f8fafc] py-3 shadow-[0_1px_0_rgba(15,23,42,0.04)]",
        // Sit directly under the fixed mobile top bar
        "top-[var(--admin-mobile-chrome-height)]",
        // Desktop: stick to the top of the content column
        "md:top-0 md:z-30 md:-mx-8 md:mb-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-5"
      )}
    >
      <h1 className="text-lg font-bold leading-tight text-foreground sm:text-xl md:text-2xl">
        {title}
      </h1>
      {children ? (
        <div className="flex w-full shrink-0 justify-stretch sm:w-auto sm:justify-end [&_a]:inline-flex [&_a]:w-full [&_a]:items-center [&_a]:justify-center sm:[&_a]:w-auto [&_button]:inline-flex [&_button]:w-full [&_button]:items-center [&_button]:justify-center sm:[&_button]:w-auto">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function AdminPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-white shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch]">
      <table className="w-full min-w-[36rem] text-sm md:min-w-[720px]">
        {children}
      </table>
    </div>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-border bg-brand-tint/40">
      <tr className="text-left text-[10px] uppercase tracking-wide text-ink-muted sm:text-[11px] md:text-xs">
        {children}
      </tr>
    </thead>
  );
}

export function AdminTableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border/80">{children}</tbody>;
}

export function AdminTableRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr className={cn("transition-colors hover:bg-brand-tint/20", className)}>
      {children}
    </tr>
  );
}

export function AdminTableCell({
  children,
  className,
  colSpan,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td className={cn("px-3 py-2.5 sm:p-3 md:p-4", className)} colSpan={colSpan}>
      {children}
    </td>
  );
}

export function AdminTableHeaderCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th className={cn("px-3 py-2.5 font-semibold sm:p-3 md:p-4", className)}>
      {children}
    </th>
  );
}

export function AdminEmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-10 text-center text-sm text-muted sm:px-5 md:p-10">
      {children}
    </div>
  );
}

export function AdminSectionHeader({
  title,
  count,
}: {
  title: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-sm font-bold text-brand sm:text-base">{title}</h2>
      <span className="shrink-0 rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-semibold text-brand sm:px-3 sm:text-xs">
        {count} {count === 1 ? "item" : "items"}
      </span>
    </div>
  );
}
