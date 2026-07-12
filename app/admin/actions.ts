"use server";

import { AuthError } from "@auth/core/errors";
import { isRedirectError } from "next/dist/client/components/redirect-error";
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
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin/dashboard",
    });
  } catch (error) {
    // Successful sign-in throws a redirect — rethrow so Next can navigate.
    if (isRedirectError(error)) throw error;

    if (error instanceof AuthError) {
      return { error: "Invalid email or password" };
    }

    return { error: "Something went wrong. Please try again." };
  }

  return { error: null };
}
