import { NextRequest, NextResponse } from "next/server";
import { analyzeTicket } from "@/lib/ai/service";
import { handleAIError } from "@/lib/ai/handle-error";

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();
    if (!description || typeof description !== "string" || description.trim().length < 10) {
      return NextResponse.json({ error: "Add a bit more detail before analyzing." }, { status: 400 });
    }
    const result = await analyzeTicket(description);
    return NextResponse.json(result);
  } catch (error) {
    return handleAIError(error);
  }
}
