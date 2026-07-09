"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminPasswordForm({ email }: { email: string }) {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPass !== confirm) {
      setMessage("New passwords do not match");
      setSuccess(false);
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, currentPassword: current, newPassword: newPass }),
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setMessage("Password updated successfully");
      setCurrent("");
      setNewPass("");
      setConfirm("");
    } else {
      setSuccess(false);
      const data = await res.json();
      setMessage(data.error ?? "Failed to update password");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Profile — Update Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Current Password" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
          <Input placeholder="New Password" type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} required />
          <Input placeholder="Confirm New Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <Button type="submit" variant="outline" disabled={loading} className="w-full">
            Update Password
          </Button>
          {message && (
            <p className={`text-sm ${success ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
