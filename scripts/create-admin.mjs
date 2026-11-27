import { neon } from "@neondatabase/serverless";
import { hash } from "bcryptjs";

async function main() {
  const { DATABASE_URL, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!DATABASE_URL || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Missing required environment variables.");
  }

  const name = ADMIN_NAME.trim();
  const email = ADMIN_EMAIL.trim().toLowerCase();
  const password = ADMIN_PASSWORD;

  if (!name || !email.includes("@") || password.length < 12) {
    throw new Error(
      "Invalid administrator data. Password must contain at least 12 characters.",
    );
  }

  const sql = neon(DATABASE_URL);

  const existing = await sql`
    SELECT id
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;

  if (existing.length > 0) {
    throw new Error("A user with this email already exists.");
  }

  const passwordHash = await hash(password, 12);

  const rows = await sql`
    INSERT INTO users (name, email, password_hash, role)
    VALUES (${name}, ${email}, ${passwordHash}, 'admin')
    RETURNING id, name, email, role
  `;

  console.log("Administrator created successfully:");
  console.table(rows);
}

main().catch((error) => {
  console.error("Failed to create administrator:", error.message);
  process.exitCode = 1;
});
