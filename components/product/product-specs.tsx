import { cn } from "@/lib/utils";

type SpecType = "KEY_VALUE" | "BULLET_LIST";

interface KeyValueSpec {
  key: string;
  value: string;
}

interface ProductSpecsProps {
  specType: SpecType;
  specifications: unknown;
  className?: string;
}

function parseKeyValueSpecs(specifications: unknown): KeyValueSpec[] {
  if (!specifications) return [];

  if (Array.isArray(specifications)) {
    return specifications
      .map((item) => {
        if (
          item &&
          typeof item === "object" &&
          "key" in item &&
          "value" in item
        ) {
          return {
            key: String((item as KeyValueSpec).key),
            value: String((item as KeyValueSpec).value),
          };
        }
        return null;
      })
      .filter((item): item is KeyValueSpec => item !== null);
  }

  if (typeof specifications === "object") {
    return Object.entries(specifications as Record<string, unknown>).map(
      ([key, value]) => ({
        key,
        value: String(value),
      })
    );
  }

  return [];
}

function parseBulletSpecs(specifications: unknown): string[] {
  if (!specifications) return [];

  if (Array.isArray(specifications)) {
    return specifications.map((item) => String(item));
  }

  return [];
}

export function ProductSpecs({
  specType,
  specifications,
  className,
}: ProductSpecsProps) {
  if (specType === "BULLET_LIST") {
    const items = parseBulletSpecs(specifications);

    if (items.length === 0) {
      return (
        <p className={cn("text-sm text-ink-muted", className)}>
          No specifications available.
        </p>
      );
    }

    return (
      <ul className={cn("space-y-2.5", className)}>
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start gap-2.5 text-sm text-ink"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  const entries = parseKeyValueSpecs(specifications);

  if (entries.length === 0) {
    return (
      <p className={cn("text-sm text-ink-muted", className)}>
        No specifications available.
      </p>
    );
  }

  return (
    <dl className={cn("overflow-hidden rounded-xl", className)}>
      {entries.map((entry, index) => (
        <div
          key={entry.key}
          className={cn(
            "grid gap-0.5 px-0 py-3 text-sm sm:grid-cols-[minmax(7rem,0.9fr)_minmax(0,1.4fr)] sm:gap-4 sm:px-1",
            index > 0 && "border-t border-border/80"
          )}
        >
          <dt className="text-[12px] font-semibold uppercase tracking-wide text-ink-subtle sm:text-sm sm:normal-case sm:tracking-normal sm:font-medium">
            {entry.key}
          </dt>
          <dd className="font-semibold text-ink sm:text-right md:text-left">
            {entry.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
