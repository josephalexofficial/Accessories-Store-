"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import type { DeliveryLocationOption } from "@/lib/delivery-location-types";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DeliveryLocationSelectProps {
  locations: DeliveryLocationOption[];
  value: DeliveryLocationOption | null;
  onChange: (location: DeliveryLocationOption | null) => void;
  required?: boolean;
}

export function DeliveryLocationSelect({
  locations,
  value,
  onChange,
  required = true,
}: DeliveryLocationSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return locations;
    return locations.filter((location) =>
      location.name.toLowerCase().includes(term)
    );
  }, [locations, query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        if (value) setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const displayValue = open ? query : value ? value.name : query;

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      <label
        htmlFor="deliveryLocationSearch"
        className="text-sm font-medium text-ink"
      >
        Delivery Location <span className="text-red-500">*</span>
      </label>

      <div
        className={cn(
          "flex h-11 w-full items-center gap-2 rounded-lg border bg-white px-3 transition-colors",
          open
            ? "border-brand ring-2 ring-brand/20"
            : "border-border hover:border-brand/40"
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-ink-subtle" aria-hidden />
        <input
          ref={inputRef}
          id="deliveryLocationSearch"
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="delivery-location-list"
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="Search for your town..."
          value={displayValue}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (value) onChange(null);
          }}
          className="h-full min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-subtle"
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={open ? "Close location list" : "Open location list"}
          onClick={() => {
            setOpen((prev) => !prev);
            if (!open) inputRef.current?.focus();
          }}
          className="shrink-0 text-ink-subtle"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
      </div>

      {required && (
        <input
          tabIndex={-1}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          value={value?.id ?? ""}
          required
          onChange={() => undefined}
          aria-hidden
        />
      )}

      {open && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-border bg-white shadow-lg">
          <ul
            id="delivery-location-list"
            role="listbox"
            className="max-h-64 overflow-y-auto py-1"
            aria-label="Delivery locations"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-muted">
                No towns found.
              </li>
            ) : (
              filtered.map((location) => {
                const selected = value?.id === location.id;
                return (
                  <li key={location.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        onChange(location);
                        setQuery("");
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                        selected
                          ? "bg-brand-tint text-brand"
                          : "text-ink hover:bg-surface"
                      )}
                    >
                      <span className="font-semibold">{location.name}</span>
                      <span className="shrink-0 font-semibold">
                        {formatPrice(location.fee)}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
