"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { slugify, cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { AdminPanel } from "@/components/admin/admin-ui";

type SpecRow = { key: string; value: string };
type SpecType = "KEY_VALUE" | "BULLET_LIST";
type StockStatus = "IN_STOCK" | "LOW_STOCK" | "SOLD_OUT";

export type AdminProductFormInitial = {
  title: string;
  brand: string;
  category: string;
  price: string;
  isSale: boolean;
  salePrice: string;
  stockStatus: StockStatus;
  imageUrl: string;
  specType: SpecType;
  specifications: unknown;
};

function parseSpecRows(specifications: unknown): SpecRow[] {
  if (!Array.isArray(specifications) || specifications.length === 0) {
    return [{ key: "", value: "" }];
  }
  if (typeof specifications[0] === "string") {
    return [{ key: "", value: "" }];
  }
  return (specifications as Array<Record<string, unknown>>).map((row) => ({
    key: String(row.key ?? row.label ?? ""),
    value: String(row.value ?? ""),
  }));
}

function parseBulletText(specifications: unknown): string {
  if (!Array.isArray(specifications)) return "";
  if (specifications.length === 0) return "";
  if (typeof specifications[0] === "string") {
    return specifications.map((line) => String(line)).join("\n");
  }
  return "";
}

export function AdminProductForm({
  mode,
  productId,
  initial,
}: {
  mode: "create" | "edit";
  productId?: string;
  initial?: AdminProductFormInitial;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [brand, setBrand] = useState(initial?.brand ?? "");
  const [category, setCategory] = useState(initial?.category ?? "Laptops");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [isSale, setIsSale] = useState(initial?.isSale ?? false);
  const [salePrice, setSalePrice] = useState(initial?.salePrice ?? "");
  const [stockStatus, setStockStatus] = useState<StockStatus>(
    initial?.stockStatus ?? "IN_STOCK"
  );
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [specType, setSpecType] = useState<SpecType>(
    initial?.specType ?? "KEY_VALUE"
  );
  const [specRows, setSpecRows] = useState<SpecRow[]>(() =>
    parseSpecRows(initial?.specifications)
  );
  const [bulletText, setBulletText] = useState(() =>
    parseBulletText(initial?.specifications)
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const specifications =
      specType === "KEY_VALUE"
        ? specRows.filter((r) => r.key.trim())
        : bulletText.split("\n").filter((line) => line.trim());

    const payload = {
      title: title.trim(),
      brand: brand.trim(),
      slug: slugify(title.trim()),
      category,
      price: parseFloat(price),
      isSale,
      salePrice: isSale && salePrice ? parseFloat(salePrice) : null,
      stockStatus,
      imageUrl: imageUrl.trim() || null,
      specType,
      specifications,
    };

    try {
      const res = await fetch(
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${productId}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : mode === "create"
              ? "Could not create product."
              : "Could not save product changes."
        );
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError(
        mode === "create"
          ? "Could not create product."
          : "Could not save product changes."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/admin/products"
          className={buttonVariants({ variant: "secondary", size: "sm" })}
        >
          <ArrowLeft className="h-4 w-4" />
          All products
        </Link>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <AdminPanel className="overflow-visible p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs uppercase text-muted">
                Product Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase text-muted">
                  Brand
                </label>
                <Input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase text-muted">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
                >
                  {CATEGORIES.filter((c) => c !== "All Products").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs uppercase text-muted">
                  Base Price (Ksh)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase text-muted">
                  Stock status
                </label>
                <select
                  value={stockStatus}
                  onChange={(e) =>
                    setStockStatus(e.target.value as StockStatus)
                  }
                  className="flex h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
                >
                  <option value="IN_STOCK">In stock</option>
                  <option value="LOW_STOCK">Low stock</option>
                  <option value="SOLD_OUT">Sold out</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase text-muted">
                Image URL
              </label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={isSale}
                onChange={(e) => setIsSale(e.target.checked)}
              />
              Mark as Promotional Deal
            </label>

            {isSale ? (
              <div>
                <label className="mb-2 block text-xs uppercase text-muted">
                  Sale Price (Ksh)
                </label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  required
                />
              </div>
            ) : null}

            <div>
              <label className="mb-2 block text-xs uppercase text-muted">
                Specification Type
              </label>
              <select
                value={specType}
                onChange={(e) => setSpecType(e.target.value as SpecType)}
                className="flex h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
              >
                <option value="KEY_VALUE">Key-Value Property Grid</option>
                <option value="BULLET_LIST">Bullet List</option>
              </select>
            </div>

            {specType === "KEY_VALUE" ? (
              <div className="space-y-3">
                {specRows.map((row, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="Label"
                      value={row.key}
                      onChange={(e) => {
                        const next = [...specRows];
                        next[i] = { ...next[i], key: e.target.value };
                        setSpecRows(next);
                      }}
                    />
                    <Input
                      placeholder="Value"
                      value={row.value}
                      onChange={(e) => {
                        const next = [...specRows];
                        next[i] = { ...next[i], value: e.target.value };
                        setSpecRows(next);
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setSpecRows(specRows.filter((_, j) => j !== i))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSpecRows([...specRows, { key: "", value: "" }])
                  }
                >
                  <Plus className="h-4 w-4" /> Add Property Row
                </Button>
              </div>
            ) : (
              <textarea
                value={bulletText}
                onChange={(e) => setBulletText(e.target.value)}
                placeholder="Type each feature on a new line..."
                rows={6}
                className="w-full rounded-lg border border-border bg-card p-3 text-sm"
              />
            )}

            {error ? (
              <p
                className={cn(
                  "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600"
                )}
              >
                {error}
              </p>
            ) : null}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {loading
                ? "Saving…"
                : mode === "create"
                  ? "Create Product"
                  : "Save Changes"}
            </Button>
          </form>
        </AdminPanel>
      </div>
    </div>
  );
}
