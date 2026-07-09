import OpenAI from "openai";

export type EmailClassification =
  | "general_inquiry"
  | "booking_question"
  | "refund_complaint"
  | "payment_proof"
  | "spam";

// Section 10: hard denylist, no AI needed — the #1 rule is never auto-reply to
// notification noise, since a wrong auto-reply risks a Resend account suspension.
const DENYLIST_DOMAINS = [
  "facebookmail.com",
  "instagram.com",
  "linkedin.com",
  "twitter.com",
  "x.com",
  "notifications.google.com",
  "no-reply@",
  "noreply@",
  "mailer-daemon@",
];

const REFUND_KEYWORDS = /\b(refund|complain|complaint|cancel my booking|unacceptable|scam|fraud|disappointed|angry|lawyer|legal action)\b/i;
const PAYMENT_KEYWORDS = /\b(payment proof|transferred|paid|receipt attached|deposit slip)\b/i;
const BOOKING_KEYWORDS = /\b(booking|departure|seat|itinerary|package|reservation)\b/i;

export function isDenylisted(senderEmail: string, subject: string): boolean {
  const lower = senderEmail.toLowerCase();
  if (DENYLIST_DOMAINS.some((d) => lower.includes(d))) return true;
  if (/unsubscribe|notification|no-reply/i.test(subject)) return true;
  return false;
}

function classifyByRules(subject: string, body: string): EmailClassification | null {
  const text = `${subject}\n${body}`;
  if (REFUND_KEYWORDS.test(text)) return "refund_complaint";
  if (PAYMENT_KEYWORDS.test(text)) return "payment_proof";
  if (BOOKING_KEYWORDS.test(text)) return "booking_question";
  return null;
}

async function classifyByModel(subject: string, body: string): Promise<EmailClassification> {
  if (!process.env.OPENAI_API_KEY) return "general_inquiry";

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content:
          "Classify this inbound email for a travel agency into exactly one of: " +
          "general_inquiry, booking_question, refund_complaint, payment_proof, spam. " +
          "Reply with only the label, nothing else.",
      },
      { role: "user", content: `Subject: ${subject}\n\n${body}` },
    ],
  });

  const label = completion.choices[0]?.message?.content?.trim() as EmailClassification | undefined;
  const valid: EmailClassification[] = ["general_inquiry", "booking_question", "refund_complaint", "payment_proof", "spam"];
  return label && valid.includes(label) ? label : "general_inquiry";
}

export async function classifyEmail(senderEmail: string, subject: string, body: string): Promise<EmailClassification> {
  if (isDenylisted(senderEmail, subject)) return "spam";

  const ruleMatch = classifyByRules(subject, body);
  if (ruleMatch) return ruleMatch;

  return classifyByModel(subject, body);
}
