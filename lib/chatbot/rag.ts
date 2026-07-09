import { createAdminClient } from "@/lib/supabase/admin";
import OpenAI from "openai";
import { tokenize, normalizeQuestion, jaccardSimilarity } from "@/lib/chatbot/normalize";

export interface RagResult {
  answer: string;
  usedAi: boolean;
  needsHuman: boolean;
}

const CACHE_SIMILARITY_THRESHOLD = 0.6;

function humanFallbackMessage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const email = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
  const contacts = [
    whatsapp ? `WhatsApp ${whatsapp}` : null,
    email ? `email ${email}` : null,
  ].filter(Boolean);

  if (contacts.length === 0) {
    return "One of our team members will assist you shortly 🙏";
  }
  return `I don't have that information yet — please contact our team directly via ${contacts.join(" or ")} and we'll help you right away 🙏`;
}

/**
 * Section 9: RAG-first, gpt-4o-mini fallback only on miss. Static keyword lookup
 * against chatbot_knowledge costs nothing — every avoided model call is avoided cost.
 * Matches manual admin entries and tour-event auto-synced entries (both use
 * hand-written/generated keyword patterns, so substring matching works well).
 */
async function keywordLookup(message: string, entries: { id: string; question_pattern: string; answer: string; hit_count: number }[]) {
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

  return best?.entry ?? null;
}

/**
 * Fuzzy match against previously AI-answered questions so repeats — or the
 * same question worded differently — are served for free instead of hitting
 * the model again. Exact-normalized match short-circuits to a cheap string
 * compare; otherwise falls back to token Jaccard similarity.
 */
async function cacheLookup(
  message: string,
  cacheEntries: { id: string; answer: string; normalized_question: string | null; hit_count: number }[]
) {
  const incomingTokens = tokenize(message);
  const incomingNormalized = normalizeQuestion(message);
  if (incomingTokens.length === 0) return null;

  let best: { entry: (typeof cacheEntries)[number]; score: number } | null = null;
  for (const entry of cacheEntries) {
    if (!entry.normalized_question) continue;
    if (entry.normalized_question === incomingNormalized) {
      return entry;
    }
    const score = jaccardSimilarity(incomingTokens, entry.normalized_question.split(" "));
    if (score >= CACHE_SIMILARITY_THRESHOLD && (!best || score > best.score)) {
      best = { entry, score };
    }
  }

  return best?.entry ?? null;
}

async function askModel(message: string, context: string): Promise<{ answer: string; needsHuman: boolean }> {
  if (!process.env.OPENAI_API_KEY) {
    return { answer: humanFallbackMessage(), needsHuman: true };
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "You are the on-site and WhatsApp assistant for S.Religious Tours, a Pakistan-based Islamic travel agency. " +
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
    return { answer: humanFallbackMessage(), needsHuman: true };
  }
  return { answer, needsHuman: false };
}

export async function answerCustomerMessage(message: string): Promise<RagResult> {
  const admin = createAdminClient();
  const { data: allEntries } = await admin
    .from("chatbot_knowledge")
    .select("id, question_pattern, answer, hit_count, source, normalized_question");

  const entries = allEntries ?? [];
  const staticEntries = entries.filter((e) => e.source !== "ai_cache");
  const cacheEntries = entries.filter((e) => e.source === "ai_cache");

  const staticHit = await keywordLookup(message, staticEntries);
  if (staticHit) {
    await admin.from("chatbot_knowledge").update({ hit_count: staticHit.hit_count + 1 }).eq("id", staticHit.id);
    return { answer: staticHit.answer, usedAi: false, needsHuman: false };
  }

  const cacheHit = await cacheLookup(message, cacheEntries);
  if (cacheHit) {
    await admin.from("chatbot_knowledge").update({ hit_count: cacheHit.hit_count + 1 }).eq("id", cacheHit.id);
    return { answer: cacheHit.answer, usedAi: false, needsHuman: false };
  }

  const context = staticEntries.slice(0, 50).map((e) => `Q: ${e.question_pattern}\nA: ${e.answer}`).join("\n\n");
  const { answer, needsHuman } = await askModel(message, context);

  if (!needsHuman) {
    await admin.from("chatbot_knowledge").insert({
      question_pattern: message.slice(0, 200),
      normalized_question: normalizeQuestion(message),
      answer,
      source: "ai_cache",
      hit_count: 0,
    });
  }

  return { answer, usedAi: true, needsHuman };
}
