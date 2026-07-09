"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AddAdminForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);
    if (res.ok) {
      setMessage("Admin created successfully");
      setEmail("");
      setPassword("");
      setConfirm("");
    } else {
      const data = await res.json();
      setMessage(data.error ?? "Failed to create admin");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Admin</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="New Admin Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input placeholder="Temporary Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input placeholder="Confirm Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <Button type="submit" disabled={loading} className="w-full">
            Create Admin Account
          </Button>
          {message && <p className="text-sm text-muted">{message}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
