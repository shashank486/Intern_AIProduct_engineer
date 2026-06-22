import { NextRequest, NextResponse } from "next/server";
import { summarizeTicket } from "@/lib/ai/service";
import { handleAIError } from "@/lib/ai/handle-error";

export async function POST(req: NextRequest) {
  try {
    const { fullText } = await req.json();
    if (!fullText || typeof fullText !== "string" || fullText.trim().length < 5) {
      return NextResponse.json({ error: "Not enough content to summarize." }, { status: 400 });
    }
    const result = await summarizeTicket(fullText);
    return NextResponse.json(result);
  } catch (error) {
    return handleAIError(error);
  }
}
