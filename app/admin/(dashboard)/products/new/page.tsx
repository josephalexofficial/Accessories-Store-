"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminPageHeader, AdminPanel } from "@/components/admin/admin-ui";
import { Plus, Trash2 } from "lucide-react";

type SpecRow = { key: string; value: string };

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Laptops");
  const [price, setPrice] = useState("");
  const [isSale, setIsSale] = useState(false);
  const [salePrice, setSalePrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [specType, setSpecType] = useState<"KEY_VALUE" | "BULLET_LIST">("KEY_VALUE");
  const [specRows, setSpecRows] = useState<SpecRow[]>([{ key: "", value: "" }]);
  const [bulletText, setBulletText] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const specifications =
      specType === "KEY_VALUE"
        ? specRows.filter((r) => r.key.trim())
        : bulletText.split("\n").filter((line) => line.trim());

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        brand,
        slug: slugify(title),
        category,
        price: parseFloat(price),
        isSale,
        salePrice: isSale ? parseFloat(salePrice) : null,
        imageUrl: imageUrl || null,
        specType,
        specifications,
      }),
    });

    setLoading(false);
    if (res.ok) router.push("/admin/products");
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Add New Product" />

      <div className="mx-auto w-full max-w-2xl">
        <AdminPanel className="p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-xs uppercase text-muted">Product Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs uppercase text-muted">Brand</label>
            <Input value={brand} onChange={(e) => setBrand(e.target.value)} required />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase text-muted">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border bg-card px-3 text-sm"
            >
              {CATEGORIES.filter((c) => c !== "All Products").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs uppercase text-muted">Base Price (Ksh)</label>
            <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase text-muted">Image URL</label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" checked={isSale} onChange={(e) => setIsSale(e.target.checked)} />
          Mark as Promotional Deal
        </label>

        {isSale && (
          <div>
            <label className="mb-2 block text-xs uppercase text-muted">Sale Price (Ksh)</label>
            <Input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} required />
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs uppercase text-muted">Specification Type</label>
          <select
            value={specType}
            onChange={(e) => setSpecType(e.target.value as "KEY_VALUE" | "BULLET_LIST")}
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
                <Input placeholder="Label" value={row.key} onChange={(e) => {
                  const next = [...specRows];
                  next[i].key = e.target.value;
                  setSpecRows(next);
                }} />
                <Input placeholder="Value" value={row.value} onChange={(e) => {
                  const next = [...specRows];
                  next[i].value = e.target.value;
                  setSpecRows(next);
                }} />
                <Button type="button" variant="ghost" size="icon" onClick={() => setSpecRows(specRows.filter((_, j) => j !== i))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => setSpecRows([...specRows, { key: "", value: "" }])}>
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

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving..." : "Create Product"}
        </Button>
      </form>
        </AdminPanel>
      </div>
    </div>
  );
}
