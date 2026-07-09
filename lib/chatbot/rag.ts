import { createAdminClient } from "@/lib/supabase/admin";
import OpenAI from "openai";

export interface RagResult {
  answer: string;
  usedAi: boolean;
  needsHuman: boolean;
}

/**
 * Section 9: RAG-first, gpt-4o-mini fallback only on miss. Static keyword lookup
 * against chatbot_knowledge costs nothing — every avoided model call is avoided cost.
 */
async function keywordLookup(message: string) {
  const admin = createAdminClient();
  const { data: entries } = await admin.from("chatbot_knowledge").select("*");
  if (!entries || entries.length === 0) return null;

  const normalized = message.toLowerCase();
  let best: { entry: (typeof entries)[number]; score: number } | null = null;

  for (const entry of entries) {
    const keywords: string[] = entry.question_pattern.toLowerCase().split(/\s+/).filter(Boolean);
    const hits = keywords.filter((k: string) => normalized.includes(k)).length;
    const score = keywords.length > 0 ? hits / keywords.length : 0;
    if (score > 0.6 && (!best || score > best.score)) {
      best = { entry, score };
    }
  }

  if (best) {
    await admin.from("chatbot_knowledge").update({ hit_count: best.entry.hit_count + 1 }).eq("id", best.entry.id);
    return best.entry.answer;
  }
  return null;
}

async function askModel(message: string, context: string): Promise<{ answer: string; needsHuman: boolean }> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      answer: "One of our team members will assist you shortly 🙏",
      needsHuman: true,
    };
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "You are the WhatsApp assistant for Religious Tours, a Pakistan-based Islamic travel agency. " +
          "Answer ONLY using the context block below. If the question needs account-specific info " +
          "(a booking status, a refund, a complaint) or isn't covered by the context, reply with exactly: " +
          "NEEDS_HUMAN\n\nContext:\n" +
          context,
      },
      { role: "user", content: message },
    ],
  });

  const answer = completion.choices[0]?.message?.content?.trim() ?? "NEEDS_HUMAN";
  if (answer === "NEEDS_HUMAN" || answer.length === 0) {
    return { answer: "One of our team members will assist you shortly 🙏", needsHuman: true };
  }
  return { answer, needsHuman: false };
}

export async function answerCustomerMessage(message: string): Promise<RagResult> {
  const staticAnswer = await keywordLookup(message);
  if (staticAnswer) {
    return { answer: staticAnswer, usedAi: false, needsHuman: false };
  }

  const admin = createAdminClient();
  const { data: entries } = await admin.from("chatbot_knowledge").select("question_pattern, answer").limit(50);
  const context = (entries ?? []).map((e) => `Q: ${e.question_pattern}\nA: ${e.answer}`).join("\n\n");

  const { answer, needsHuman } = await askModel(message, context);
  return { answer, usedAi: true, needsHuman };
}
