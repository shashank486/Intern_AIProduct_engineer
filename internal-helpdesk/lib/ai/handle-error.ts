import { NextResponse } from "next/server";

export function handleAIError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown AI error";
  const isConfigError = message.includes("OPENAI_API_KEY");
  return NextResponse.json(
    { error: message, code: isConfigError ? "AI_NOT_CONFIGURED" : "AI_ERROR" },
    { status: isConfigError ? 503 : 500 }
  );
}
