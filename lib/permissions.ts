export type UserRole = "admin" | "tester" | "user";

export function canManageMeetings(role: UserRole | null | undefined): boolean {
  return role === "admin" || role === "tester";
}
