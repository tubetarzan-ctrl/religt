/** Accepts a raw 11-char YouTube video ID or any common YouTube URL format
 * (watch, youtu.be, embed, shorts) and returns just the video ID, or null if
 * it can't find one — used everywhere admins paste a YouTube link/ID so a
 * pasted full URL never breaks the embed (it silently fails to invalid ID). */
export function extractYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.slice(1).split("/")[0];
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }
    if (url.hostname.includes("youtube.com")) {
      const vParam = url.searchParams.get("v");
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) return vParam;

      const match = url.pathname.match(/\/(?:embed|shorts)\/([a-zA-Z0-9_-]{11})/);
      if (match) return match[1];
    }
  } catch {
    // not a valid URL — fall through
  }

  return null;
}
