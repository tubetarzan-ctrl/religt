"use client";

import { motion } from "framer-motion";
import { SceneArt } from "@/components/marketing/scene-art";
import { YoutubeBackground } from "@/components/marketing/youtube-background";

/**
 * Full-bleed immersive break between content sections. Uses a YouTube embed
 * when moodVideoYoutubeId is set on the vertical (lib/content/verticals.ts);
 * otherwise falls back to the SVG artwork with a slow Ken Burns zoom.
 */
export function MoodSection({ quote, videoId }: { quote: string; videoId?: string }) {
  return (
    <section className="relative h-[420px] overflow-hidden bg-[#0b0f14]">
      {videoId ? (
        <YoutubeBackground videoId={videoId} />
      ) : (
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 18, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        >
          <SceneArt variant="skyline" className="h-full w-full opacity-80" />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
      <div className="relative flex h-full items-center justify-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl text-center font-heading text-2xl text-white sm:text-3xl"
        >
          &ldquo;{quote}&rdquo;
        </motion.p>
      </div>
    </section>
  );
}
