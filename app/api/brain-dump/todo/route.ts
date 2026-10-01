import { NextResponse } from "next/server";
import { z } from "zod";
import { extractItemsFromText } from "@/lib/ai/claude-client";

export const runtime = "nodejs";

const RequestSchema = z.object({
  text: z.string().min(1).max(8000),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  try {
    const items = await extractItemsFromText(parsed.data.text);
    return NextResponse.json({ items });
  } catch (error) {
    if (error instanceof Error && error.message === "ANTHROPIC_API_KEY is not configured") {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }

    const status =
      typeof error === "object" && error !== null && "status" in error
        ? Number((error as { status?: unknown }).status)
        : undefined;

    if (status === 429 || status === 529) {
      return NextResponse.json({ error: "rate_limited" }, { status: 503 });
    }

    return NextResponse.json({ error: "unknown" }, { status: 502 });
  }
}
