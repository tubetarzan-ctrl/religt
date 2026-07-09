import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { classifyEmail } from "@/lib/email/classify";
import { sendAutoReply } from "@/lib/email/send";
import { answerCustomerMessage } from "@/lib/chatbot/rag";

// Resend inbound webhooks are signed with svix — verify RESEND_INBOUND_WEBHOOK_SECRET
// via the `svix` package before trusting the payload in production. This route reads
// the shared secret header as a minimal placeholder; swap in svix.Webhook#verify()
// once the inbound integration is wired to a live Resend account.
function isAuthentic(request: NextRequest): boolean {
  const secret = process.env.RESEND_INBOUND_WEBHOOK_SECRET;
  if (!secret) return true; // not configured yet in dev
  return request.headers.get("x-webhook-secret") === secret;
}

export async function POST(request: NextRequest) {
  if (!isAuthentic(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const payload = await request.json();
  const senderEmail: string = payload.from ?? payload.sender ?? "";
  const subject: string = payload.subject ?? "(no subject)";
  const body: string = payload.text ?? payload.html ?? "";

  const admin = createAdminClient();
  const classification = await classifyEmail(senderEmail, subject, body);

  const { data: thread } = await admin
    .from("email_threads")
    .insert({
      sender_email: senderEmail,
      subject,
      classification,
      auto_replied: false,
      escalated: false,
    })
    .select()
    .single();

  // Section 10: silence is the safe default — spam is logged only, never replied to.
  if (classification === "spam") {
    return NextResponse.json({ ok: true, classification });
  }

  // Refund/complaint and payment-proof emails always go to a human — never auto-replied.
  if (classification === "refund_complaint" || classification === "payment_proof") {
    await admin.from("email_threads").update({ escalated: true }).eq("id", thread?.id);
    return NextResponse.json({ ok: true, classification, escalated: true });
  }

  // general_inquiry / booking_question — RAG auto-reply from the same knowledge base as WhatsApp.
  const { answer, needsHuman } = await answerCustomerMessage(`${subject}\n${body}`);

  if (needsHuman) {
    await admin.from("email_threads").update({ escalated: true }).eq("id", thread?.id);
    return NextResponse.json({ ok: true, classification, escalated: true });
  }

  await sendAutoReply(senderEmail, subject, answer);
  await admin.from("email_threads").update({ auto_replied: true }).eq("id", thread?.id);

  return NextResponse.json({ ok: true, classification, auto_replied: true });
}
