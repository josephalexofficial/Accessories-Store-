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
        "admin-page-header sticky z-30 -mx-4 mb-6 flex flex-col gap-3",
        "border-b border-border/80 bg-[#f8fafc]/95 px-4 py-4 backdrop-blur-sm",
        "sm:flex-row sm:items-center sm:justify-between",
        "md:-mx-8 md:px-8 md:py-5"
      )}
    >
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h1>
      {children ? (
        <div className="flex w-full shrink-0 sm:w-auto [&_a]:block [&_a]:w-full sm:[&_a]:w-auto [&_button]:w-full sm:[&_button]:w-auto">
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
    <div className="-mx-px overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">{children}</table>
    </div>
  );
}

export function AdminTableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-border bg-brand-tint/40">
      <tr className="text-left text-[11px] uppercase tracking-wide text-ink-muted md:text-xs">
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
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn("p-3 md:p-4", className)}>{children}</td>;
}

export function AdminTableHeaderCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <th className={cn("p-3 font-semibold md:p-4", className)}>{children}</th>;
}

export function AdminEmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 text-center text-sm text-muted md:p-10">{children}</div>
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
