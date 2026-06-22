import { NextRequest, NextResponse } from "next/server";
import { suggestUrgency } from "@/lib/ai/service";
import { handleAIError } from "@/lib/ai/handle-error";

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();
    if (!description || typeof description !== "string" || description.trim().length < 5) {
      return NextResponse.json({ error: "Description is too short to analyze." }, { status: 400 });
    }
    const result = await suggestUrgency(description);
    return NextResponse.json(result);
  } catch (error) {
    return handleAIError(error);
  }
}
