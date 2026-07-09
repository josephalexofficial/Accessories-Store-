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

function parseKeyValueSpecs(
  specifications: unknown
): KeyValueSpec[] {
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
        <p className={cn("text-sm text-muted", className)}>
          No specifications available.
        </p>
      );
    }

    return (
      <ul className={cn("space-y-2", className)}>
        {items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex items-start gap-2 text-sm text-foreground"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  const entries = parseKeyValueSpecs(specifications);

  if (entries.length === 0) {
    return (
      <p className={cn("text-sm text-muted", className)}>
        No specifications available.
      </p>
    );
  }

  return (
    <dl className={cn("divide-y divide-border rounded-lg border border-border", className)}>
      {entries.map((entry) => (
        <div
          key={entry.key}
          className="grid grid-cols-2 gap-4 px-4 py-3 text-sm even:bg-white/[0.02] sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
        >
          <dt className="font-medium text-muted">{entry.key}</dt>
          <dd className="text-foreground">{entry.value}</dd>
        </div>
      ))}
    </dl>
  );
}
