import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { answerCustomerMessage } from "@/lib/chatbot/rag";
import { sendWhatsappMessage } from "@/lib/whatsapp/send";

// Meta's webhook verification handshake (Section 9 / 14: WHATSAPP_WEBHOOK_VERIFY_TOKEN).
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return new NextResponse("Forbidden", { status: 403 });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  const admin = createAdminClient();

  const entry = payload.entry?.[0];
  const change = entry?.changes?.[0];
  const message = change?.value?.messages?.[0];

  if (!message || message.type !== "text") {
    // Non-text (image/audio/status callbacks) — acknowledge without processing.
    return NextResponse.json({ ok: true });
  }

  const from: string = message.from;
  const body: string = message.text.body;

  let { data: conversation } = await admin
    .from("whatsapp_conversations")
    .select("*")
    .eq("customer_phone", from)
    .eq("status", "bot_active")
    .maybeSingle();

  if (!conversation) {
    const { data: created } = await admin
      .from("whatsapp_conversations")
      .insert({ customer_phone: from, status: "bot_active" })
      .select()
      .single();
    conversation = created;
  }

  if (!conversation) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  await admin.from("whatsapp_messages").insert({
    conversation_id: conversation.id,
    direction: "inbound",
    body,
    used_ai: false,
  });

  // Once escalated, a human owns the thread — stop auto-replying (Section 9, step 5).
  if (conversation.status === "needs_human") {
    return NextResponse.json({ ok: true });
  }

  const { answer, usedAi, needsHuman } = await answerCustomerMessage(body);

  await sendWhatsappMessage(from, answer);

  await admin.from("whatsapp_messages").insert({
    conversation_id: conversation.id,
    direction: "outbound",
    body: answer,
    used_ai: usedAi,
  });

  if (needsHuman) {
    await admin.from("whatsapp_conversations").update({ status: "needs_human" }).eq("id", conversation.id);
  }

  return NextResponse.json({ ok: true });
}
