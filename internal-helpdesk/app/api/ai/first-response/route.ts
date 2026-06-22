import { NextRequest, NextResponse } from "next/server";
import { generateFirstResponse } from "@/lib/ai/service";
import { handleAIError } from "@/lib/ai/handle-error";
import { DepartmentSlug } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { description, employeeName, department } = await req.json();
    if (!description || typeof description !== "string" || description.trim().length < 5) {
      return NextResponse.json({ error: "Description is too short to analyze." }, { status: 400 });
    }
    const result = await generateFirstResponse(description, employeeName || "there", (department as DepartmentSlug) || "IT");
    return NextResponse.json(result);
  } catch (error) {
    return handleAIError(error);
  }
}
