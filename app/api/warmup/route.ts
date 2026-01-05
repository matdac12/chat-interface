import { sql } from "@/lib/db";

/**
 * Database warm-up endpoint
 *
 * Wakes up Neon's serverless Postgres compute if it has scaled to zero.
 * Call this on page load to minimize cold start delays on subsequent queries.
 */
export async function GET() {
  try {
    await sql`SELECT 1`;
    return new Response("ok", { status: 200 });
  } catch (error) {
    console.error("Database warmup failed:", error);
    return new Response("error", { status: 500 });
  }
}
