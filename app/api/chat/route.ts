import { NextRequest, NextResponse } from "next/server";
import { answerCustomerMessage } from "@/lib/chatbot/rag";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const { answer, needsHuman } = await answerCustomerMessage(message.slice(0, 1000));
  return NextResponse.json({ answer, needsHuman });
}
