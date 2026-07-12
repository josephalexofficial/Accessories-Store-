"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AddLocationForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [fee, setFee] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/delivery-locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        fee: Number(fee),
      }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setMessage("Location added successfully");
      setName("");
      setFee("");
      router.refresh();
      return;
    }

    const data = await res.json().catch(() => ({}));
    setSuccess(false);
    setMessage(data.error ?? "Failed to add location");
  }

  return (
    <Card>
      <CardHeader className="space-y-1 p-4 sm:p-6">
        <CardTitle className="text-base sm:text-lg">Add Location</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
          <Input
            placeholder="Town / Area name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="number"
            min={0}
            step={1}
            placeholder="Fee (Ksh)"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Saving..." : "Add Location"}
          </Button>
          {message && (
            <p
              className={`text-sm ${success ? "text-green-600" : "text-red-500"}`}
            >
              {message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
