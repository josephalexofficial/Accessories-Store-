"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  adminLogin,
  type AdminLoginState,
} from "@/app/admin/actions";

const initialState: AdminLoginState = { error: null };

export function AdminLoginForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(adminLogin, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  // Warm the dashboard route so navigation feels instant after auth.
  useEffect(() => {
    router.prefetch("/admin/dashboard");
  }, [router]);

  useEffect(() => {
    if (!state.error) return;
    setShake(true);
    const timer = window.setTimeout(() => setShake(false), 400);
    return () => window.clearTimeout(timer);
  }, [state.error]);

  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border bg-canvas p-7 shadow-[0_12px_40px_rgba(0,86,210,0.08)] sm:p-8",
        shake && "animate-shake"
      )}
    >
      <div className="mb-7 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-lg font-bold text-white shadow-sm">
          W
        </div>
        <h1 className="text-lg font-black tracking-[0.14em] text-brand sm:text-xl">
          WHIMSEY TECHNOLOGIES
        </h1>
        <p className="mt-2 text-sm text-ink-muted">Admin Login</p>
      </div>

      <form action={formAction} className="space-y-5">
        <div>
          <label
            htmlFor="admin-email"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-subtle"
          >
            Email
          </label>
          <Input
            id="admin-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            autoFocus
            disabled={pending}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-subtle"
          >
            Password
          </label>
          <div className="relative">
            <Input
              id="admin-password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              disabled={pending}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle transition-colors hover:text-brand"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="h-11 w-full rounded-xl text-[15px] font-bold"
          disabled={pending}
        >
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing you in…
            </>
          ) : (
            "Login"
          )}
        </Button>

        {state.error ? (
          <p className="text-center text-sm font-medium text-red-500" role="alert">
            {state.error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
