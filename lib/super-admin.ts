export const SUPER_ADMIN_EMAIL = "whimseytech@gmail.com";

export function isSuperAdmin(email?: string | null): boolean {
  return email?.trim().toLowerCase() === SUPER_ADMIN_EMAIL;
}
