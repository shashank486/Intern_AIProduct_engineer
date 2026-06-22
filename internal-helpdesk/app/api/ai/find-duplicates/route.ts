import { NextRequest, NextResponse } from "next/server";
import { findSimilarTickets } from "@/lib/ai/service";
import { handleAIError } from "@/lib/ai/handle-error";
import { tickets } from "@/lib/mock";

export async function POST(req: NextRequest) {
  try {
    const { description, department } = await req.json();
    if (!description || typeof description !== "string" || description.trim().length < 5) {
      return NextResponse.json({ error: "Description is too short to analyze." }, { status: 400 });
    }
    const candidates = tickets
      .filter((t) => !department || t.department === department)
      .map((t) => ({ id: t.id, title: t.title, description: t.description, department: t.department }));
    const result = await findSimilarTickets(description, candidates);
    return NextResponse.json(result);
  } catch (error) {
    return handleAIError(error);
  }
}
