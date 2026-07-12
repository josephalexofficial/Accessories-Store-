"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AdminTableCell,
  AdminTableRow,
} from "@/components/admin/admin-ui";
import { isSuperAdmin } from "@/lib/super-admin";

type AdminRow = {
  id: string;
  email: string;
  createdAt: string | Date;
};

export function AdminTeamRow({
  admin,
  canManage,
}: {
  admin: AdminRow;
  canManage: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const superAdmin = isSuperAdmin(admin.email);
  const canDelete = canManage && !superAdmin;

  async function handleDelete() {
    if (!canDelete) return;
    if (!window.confirm(`Remove admin ${admin.email}? This cannot be undone.`)) {
      return;
    }

    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/admins", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: admin.id }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Could not delete admin");
      return;
    }

    router.refresh();
  }

  return (
    <AdminTableRow>
      <AdminTableCell>{admin.email}</AdminTableCell>
      <AdminTableCell>
        <Badge variant={superAdmin ? "default" : "muted"}>
          {superAdmin ? "Super Admin" : "Admin"}
        </Badge>
      </AdminTableCell>
      <AdminTableCell className="text-muted">
        {new Date(admin.createdAt).toLocaleDateString()}
      </AdminTableCell>
      <AdminTableCell>
        <Badge variant="success">Active</Badge>
      </AdminTableCell>
      <AdminTableCell>
        {canDelete ? (
          <div className="flex flex-col items-start gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void handleDelete()}
              disabled={loading}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {loading ? "Removing…" : "Remove"}
            </Button>
            {error ? <p className="text-xs text-red-500">{error}</p> : null}
          </div>
        ) : (
          <span className="text-xs text-muted">—</span>
        )}
      </AdminTableCell>
    </AdminTableRow>
  );
}
