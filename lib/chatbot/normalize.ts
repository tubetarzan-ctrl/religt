const STOPWORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "do", "does", "did", "i", "im", "you", "your",
  "he", "she", "it", "we", "they", "to", "of", "in", "on", "for", "and", "or", "my", "me",
  "what", "whats", "how", "when", "where", "why", "who", "which", "can", "could", "will",
  "would", "should", "please", "about", "there", "here", "this", "that", "with", "have", "has",
  "be", "am", "if", "so", "just", "also", "tell", "know", "need", "want",
]);

/** Lowercase, strip punctuation, drop stopwords — used both for the cache
 * fingerprint and for Jaccard similarity so "price?" and "what's the price"
 * reduce to the same signal. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0 && !STOPWORDS.has(t));
}

/** Sorted token join — identical wording (any order) collapses to the same
 * string, giving an O(1) index-backed exact-match path before the O(n)
 * Jaccard fallback. */
export function normalizeQuestion(text: string): string {
  return tokenize(text).sort().join(" ");
}

export function jaccardSimilarity(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  const intersection = Array.from(setA).filter((token) => setB.has(token)).length;
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}
