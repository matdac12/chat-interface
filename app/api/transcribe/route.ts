import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Parse the multipart form data
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "File audio richiesto" },
        { status: 400 },
      );
    }

    // Validate file size (max 25MB per OpenAI limits)
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    if (audioFile.size > maxSize) {
      return NextResponse.json(
        { error: "File troppo grande. Massimo 25MB consentiti." },
        { status: 400 },
      );
    }

    // Validate file type
    const validTypes = [
      "audio/webm",
      "audio/mp3",
      "audio/mpeg",
      "audio/wav",
      "audio/m4a",
      "audio/mp4",
      "audio/ogg",
    ];

    if (!validTypes.includes(audioFile.type)) {
      console.log("File type received:", audioFile.type);
      // Still allow it - OpenAI is flexible with formats
    }

    console.log("Transcribing audio file:", {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size,
    });

    // Convert File to Buffer for OpenAI API
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a File-like object that OpenAI expects
    const file = new File([buffer], audioFile.name, { type: audioFile.type });

    // Call OpenAI Transcription API
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "gpt-4o-transcribe",
      language: "it", // Italian for better accuracy
    });

    console.log("Transcription completed successfully");
    console.log("Transcribed text length:", transcription.text.length);

    return NextResponse.json({
      success: true,
      text: transcription.text,
    });
  } catch (error) {
    console.error("Transcription API error:", error);

    // Handle specific OpenAI errors
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Errore durante la trascrizione",
          details: error.message
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "Errore durante la trascrizione dell'audio" },
      { status: 500 },
    );
  }
}
