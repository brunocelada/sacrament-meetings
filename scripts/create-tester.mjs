import { neon } from "@neondatabase/serverless";
import { hash } from "bcryptjs";

async function main() {
  const { DATABASE_URL, TESTER_NAME, TESTER_EMAIL, TESTER_PASSWORD } =
    process.env;

  if (!DATABASE_URL || !TESTER_NAME || !TESTER_EMAIL || !TESTER_PASSWORD) {
    throw new Error("Missing required environment variables.");
  }

  const name = TESTER_NAME.trim();
  const email = TESTER_EMAIL.trim().toLowerCase();
  const password = TESTER_PASSWORD;

  if (!name || !email.includes("@") || password.length < 12) {
    throw new Error(
      "Invalid tester data. Password must contain at least 12 characters.",
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
    VALUES (${name}, ${email}, ${passwordHash}, 'tester')
    RETURNING id, name, email, role
  `;

  console.log("Tester account created successfully:");
  console.table(rows);
}

main().catch((error) => {
  console.error("Failed to create tester:", error.message);
  process.exitCode = 1;
});
