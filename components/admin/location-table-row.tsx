"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AdminTableCell,
  AdminTableRow,
} from "@/components/admin/admin-ui";

type LocationRow = {
  id: string;
  name: string;
  fee: number;
  isActive: boolean;
};

export function LocationTableRow({ location }: { location: LocationRow }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(location.name);
  const [fee, setFee] = useState(String(location.fee));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function saveEdit() {
    setLoading(true);
    setError("");
    const res = await fetch(`/api/admin/delivery-locations/${location.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        fee: Number(fee),
        isActive: location.isActive,
      }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Update failed");
      return;
    }

    setEditing(false);
    router.refresh();
  }

  async function removeLocation() {
    if (!window.confirm(`Delete ${location.name}?`)) return;
    setLoading(true);
    const res = await fetch(`/api/admin/delivery-locations/${location.id}`, {
      method: "DELETE",
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Delete failed");
      return;
    }
    router.refresh();
  }

  if (editing) {
    return (
      <AdminTableRow>
        <AdminTableCell colSpan={4} className="p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="sm:flex-1"
            />
            <Input
              type="number"
              min={0}
              step={1}
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="sm:w-32"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                onClick={saveEdit}
                disabled={loading}
              >
                <Check className="h-4 w-4" />
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditing(false);
                  setName(location.name);
                  setFee(String(location.fee));
                  setError("");
                }}
                disabled={loading}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
          {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
        </AdminTableCell>
      </AdminTableRow>
    );
  }

  return (
    <AdminTableRow>
      <AdminTableCell className="font-medium">{location.name}</AdminTableCell>
      <AdminTableCell>{formatPrice(location.fee)}</AdminTableCell>
      <AdminTableCell>
        <Badge variant={location.isActive ? "success" : "muted"}>
          {location.isActive ? "Active" : "Inactive"}
        </Badge>
      </AdminTableCell>
      <AdminTableCell>
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setEditing(true)}
            disabled={loading}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={removeLocation}
            disabled={loading}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </Button>
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </AdminTableCell>
    </AdminTableRow>
  );
}
