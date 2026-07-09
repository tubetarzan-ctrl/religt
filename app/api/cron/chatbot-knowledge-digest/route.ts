import { NextRequest, NextResponse } from "next/server";
import { requireCronAuth } from "@/lib/cron-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// Section 12, item 3: daily digest of questions that fell through to gpt-4o-mini
// (used_ai = true) so the admin can add them to the static chatbot_knowledge table
// and shrink the AI-call rate over time. Logged to audit_log for now — wire to
// email/dashboard notification once that channel exists.
export async function GET(request: NextRequest) {
  const unauthorized = requireCronAuth(request);
  if (unauthorized) return unauthorized;

  const admin = createAdminClient();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: aiMessages } = await admin
    .from("whatsapp_messages")
    .select("body, conversation_id")
    .eq("direction", "outbound")
    .eq("used_ai", true)
    .gte("created_at", yesterday);

  const { data: inboundForAi } = await admin
    .from("whatsapp_messages")
    .select("body, conversation_id")
    .eq("direction", "inbound")
    .in("conversation_id", (aiMessages ?? []).map((m) => m.conversation_id));

  await admin.from("audit_log").insert({
    action: "chatbot_knowledge.daily_digest",
    entity_type: "chatbot_knowledge",
    after_state: { aiAnsweredCount: aiMessages?.length ?? 0, questions: inboundForAi },
  });

  return NextResponse.json({ ok: true, aiAnsweredCount: aiMessages?.length ?? 0 });
}
