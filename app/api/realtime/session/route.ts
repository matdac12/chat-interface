import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Build user name variable for prompt
    const userName = `${session.user.name}${session.user.lastName ? ` ${session.user.lastName}` : ''} (${session.user.email})`;

    console.log("🎙️ Creating Realtime session for:", userName);

    // Create ephemeral client secret with OpenAI Realtime API (GA version)
    // Note: We'll send the prompt ID via session.update event after WebSocket connects
    const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expires_after: {
          anchor: "created_at",
          seconds: 600 // 10 minutes
        },
        session: {
          type: "realtime",
          model: "gpt-realtime-mini", // or "gpt-realtime" for better quality
          modalities: ["text", "audio"],
          instructions: `Sei un agente Whatsapp incaricato all'assistenza clienti.
L'utente attuale è ${userName}.
Rispondi sempre in modo professionale e cordiale.`,
          voice: "verse", // Options: alloy, echo, fable, onyx, nova, shimmer
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ OpenAI Realtime API error:", errorData);
      return NextResponse.json(
        { error: "Failed to create Realtime session", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    console.log("✅ Realtime client secret created successfully");
    console.log("Client Secret ID:", data.id);
    console.log("Expires at:", data.expires_at);

    // Return the client_secret for frontend WebSocket connection
    return NextResponse.json({
      client_secret: data.client_secret.value,
      session_id: data.id,
      expires_at: data.expires_at,
      model: "gpt-realtime-mini",
      voice: "verse",
      // Note: Not using prompt_id because current prompt is for gpt-5-nano
      // To use prompts, create a new one with gpt-realtime-mini model
    });

  } catch (error) {
    console.error("❌ Realtime session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session", details: (error as Error).message },
      { status: 500 }
    );
  }
}
