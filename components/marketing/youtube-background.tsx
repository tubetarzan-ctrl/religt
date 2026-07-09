"use client";

import { useState } from "react";

/**
 * Full-bleed "background video" using a YouTube embed — lighter on page weight
 * than self-hosting mp4 files, since YouTube's own CDN does the heavy lifting.
 * The iframe is scaled up and cropped (object-fit: cover equivalent for iframes)
 * so it fills the section regardless of the source video's aspect ratio.
 *
 * The YouTube embed itself takes a beat to negotiate before the video frame
 * paints, which reads as "slow to load". We paper over that gap by showing the
 * video's own thumbnail (loads near-instantly, same CDN as YouTube itself)
 * behind the iframe, then cross-fading to the live video once its player
 * signals ready via the postMessage API.
 */
export function YoutubeBackground({ videoId }: { videoId: string }) {
  const [ready, setReady] = useState(false);

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: videoId, // required by YouTube's embed API for looping a single video
    controls: "0",
    modestbranding: "1",
    showinfo: "0",
    rel: "0",
    iv_load_policy: "3",
    playsinline: "1",
    disablekb: "1",
    enablejsapi: "1",
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
      {/* Instant-paint poster frame — same thumbnail CDN YouTube itself uses.
          Plain <img> is deliberate: next/image's optimizer round-trip would add
          back exactly the load delay this poster exists to hide. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${ready ? "opacity-0" : "opacity-100"}`}
      />
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
        title="Background video"
        allow="autoplay; encrypted-media"
        onLoad={() => setReady(true)}
        className={`absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
        style={{ border: 0 }}
      />
    </div>
  );
}
