"use server";

import { AuthError } from "@auth/core/errors";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";
import { signIn } from "@/auth";

export type AdminLoginState = {
  error: string | null;
};

export async function adminLogin(
  _prev: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    // Avoid Auth.js absolute redirects (they can follow a localhost AUTH_URL).
    // Use Next's relative redirect so we stay on the current host (Vercel or local).
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Invalid email or password" };
    }

    redirect("/admin/dashboard");
  } catch (error) {
    if (isRedirectError(error)) throw error;

    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }

    return { error: "Something went wrong. Please try again." };
  }
}
