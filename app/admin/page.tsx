import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-gradient-to-b from-brand-tint/50 via-canvas to-surface">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-4 py-6 sm:py-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-canvas/90 px-3.5 py-2 text-sm font-semibold text-ink-muted shadow-sm backdrop-blur-sm transition-colors hover:border-brand/40 hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to store
        </Link>

        <div className="flex flex-1 flex-col items-center justify-center py-10">
          <AdminLoginForm />
          <p className="mt-6 text-center text-xs text-ink-subtle">
            Staff access only ·{" "}
            <Link href="/" className="font-medium text-brand hover:underline">
              Return home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
