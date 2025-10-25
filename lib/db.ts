import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create a Neon SQL client
export const sql = neon(process.env.DATABASE_URL);

// Users
export async function getUserByEmail(email: string) {
  const result = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
  return result[0] || null;
}

export async function getUserById(id: string) {
  const result = await sql`SELECT * FROM users WHERE id = ${id} LIMIT 1`;
  return result[0] || null;
}

export async function createUser(
  email: string,
  passwordHash: string,
  name?: string,
  lastName?: string
) {
  const result = await sql`
    INSERT INTO users (email, password_hash, name, last_name)
    VALUES (${email}, ${passwordHash}, ${name}, ${lastName})
    RETURNING id, email, name, last_name, created_at
  `;
  return result[0];
}

// Conversations
export async function getConversationsByUserId(userId: string) {
  return await sql`
    SELECT * FROM conversations
    WHERE user_id = ${userId}
    ORDER BY updated_at DESC
  `;
}

export async function getConversationById(id: string, userId: string) {
  const result = await sql`
    SELECT * FROM conversations
    WHERE id = ${id} AND user_id = ${userId}
    LIMIT 1
  `;
  return result[0] || null;
}

export async function createConversation(
  userId: string,
  title: string = "Nuova Chat"
) {
  const result = await sql`
    INSERT INTO conversations (user_id, title)
    VALUES (${userId}, ${title})
    RETURNING *
  `;
  return result[0];
}

export async function updateConversation(
  id: string,
  userId: string,
  updates: {
    title?: string;
    pinned?: boolean;
    openai_conversation_id?: string;
  }
) {
  // Build update dynamically
  if (updates.title !== undefined) {
    await sql`
      UPDATE conversations
      SET title = ${updates.title}, updated_at = NOW()
      WHERE id = ${id} AND user_id = ${userId}
    `;
  }
  if (updates.pinned !== undefined) {
    await sql`
      UPDATE conversations
      SET pinned = ${updates.pinned}, updated_at = NOW()
      WHERE id = ${id} AND user_id = ${userId}
    `;
  }
  if (updates.openai_conversation_id !== undefined) {
    await sql`
      UPDATE conversations
      SET openai_conversation_id = ${updates.openai_conversation_id}, updated_at = NOW()
      WHERE id = ${id} AND user_id = ${userId}
    `;
  }

  const result = await sql`
    SELECT * FROM conversations
    WHERE id = ${id} AND user_id = ${userId}
    LIMIT 1
  `;
  return result[0] || null;
}

export async function deleteConversation(id: string, userId: string) {
  await sql`DELETE FROM conversations WHERE id = ${id} AND user_id = ${userId}`;
}

// Messages
export async function getMessagesByConversationId(conversationId: string) {
  return await sql`
    SELECT * FROM messages
    WHERE conversation_id = ${conversationId}
    ORDER BY created_at ASC
  `;
}

export async function createMessage(
  conversationId: string,
  role: "user" | "assistant",
  content: string
) {
  const result = await sql`
    INSERT INTO messages (conversation_id, role, content)
    VALUES (${conversationId}, ${role}, ${content})
    RETURNING *
  `;

  // Update conversation's updated_at timestamp
  await sql`
    UPDATE conversations
    SET updated_at = NOW()
    WHERE id = ${conversationId}
  `;

  return result[0];
}

export async function updateMessage(id: string, content: string) {
  const result = await sql`
    UPDATE messages
    SET content = ${content}, edited_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] || null;
}

export async function deleteMessage(id: string) {
  await sql`DELETE FROM messages WHERE id = ${id}`;
}

// Helper function for queries that need joins or complex logic
export async function query(queryStr: string, params: any[] = []) {
  // This is kept for backward compatibility with complex queries
  // But for simple queries, use template literals directly
  console.warn("Using legacy query function - consider migrating to template literals");
  throw new Error("Use template literals with sql`` instead of query()");
}
