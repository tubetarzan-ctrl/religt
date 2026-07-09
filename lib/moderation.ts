// Rules-based spam/profanity filter for customer-submitted reviews.
// Section 5.2 of the master brief: no AI call needed for this step.

const PROFANITY_PATTERNS = [
  /\bfuck\w*\b/i,
  /\bshit\w*\b/i,
  /\bbastard\w*\b/i,
  /\bbitch\w*\b/i,
  /\basshole\w*\b/i,
];

const SPAM_PATTERNS = [
  /https?:\/\//i, // links in review text
  /\b(?:viagra|crypto|forex|casino|loan approved|click here)\b/i,
  /(.)\1{7,}/, // repeated character flooding, e.g. "aaaaaaaa"
];

export interface ModerationResult {
  flagged: boolean;
  reason: string | null;
}

export function moderateReviewText(text: string): ModerationResult {
  const trimmed = text.trim();

  if (trimmed.length < 8) {
    return { flagged: true, reason: "Review text too short to auto-publish." };
  }

  for (const pattern of PROFANITY_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { flagged: true, reason: "Profanity detected." };
    }
  }

  for (const pattern of SPAM_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { flagged: true, reason: "Spam pattern detected." };
    }
  }

  return { flagged: false, reason: null };
}
