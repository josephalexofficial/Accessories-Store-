/** Safe ISO conversion for Date | string (unstable_cache JSON may stringify Dates). */
export function toIsoString(value: Date | string | null | undefined): string | null {
  if (value == null) return null;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  const parsed = new Date(value as never);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

export function toIsoStringRequired(value: Date | string): string {
  return toIsoString(value) ?? new Date(0).toISOString();
}
