/**
 * Utility script to reset user passwords
 * Usage: node scripts/reset-password.js <email> <new-password>
 */

const bcrypt = require("bcryptjs");
const { neon } = require("@neondatabase/serverless");

// Load environment variables
require("dotenv").config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function resetPassword(email, newPassword) {
  try {
    // Check if user exists
    const users = await sql`SELECT id, email, name FROM users WHERE email = ${email}`;

    if (users.length === 0) {
      console.log(`❌ User not found: ${email}`);
      console.log("\nWould you like to create this user? The script currently only resets passwords.");
      return;
    }

    const user = users[0];
    console.log(`✓ Found user: ${user.name} (${user.email})`);

    // Hash the new password
    console.log("⏳ Hashing password...");
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update the password
    await sql`
      UPDATE users
      SET password_hash = ${passwordHash},
          updated_at = NOW()
      WHERE email = ${email}
    `;

    console.log(`✅ Password successfully updated for ${email}`);
    console.log(`   New password: ${newPassword}`);

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log("Usage: node scripts/reset-password.js <email> <new-password>");
  console.log("\nExample:");
  console.log('  node scripts/reset-password.js user@example.com "MyNewPassword123"');
  process.exit(1);
}

const [email, password] = args;

resetPassword(email, password);
