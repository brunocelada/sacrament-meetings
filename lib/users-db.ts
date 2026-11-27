import { sql } from "@/lib/db/client";

export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export async function getUserByEmail(email: string): Promise<AuthUser | null> {
  const normalizedEmail = email.trim().toLowerCase();

  const rows = await sql`
    SELECT
      id,
      name,
      email,
      password_hash AS "passwordHash",
      role
    FROM users
    WHERE email = ${normalizedEmail}
    LIMIT 1
  `;

  const user = rows[0];

  if (!user) {
    return null;
  }

  if (user.role !== "admin" && user.role !== "user") {
    throw new Error("Invalid user role.");
  }

  return {
    id: String(user.id),
    name: user.name,
    email: user.email,
    passwordHash: user.passwordHash,
    role: user.role,
  };
}
