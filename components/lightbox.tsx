"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface LightboxItem {
  type: "image" | "youtube";
  src: string; // image URL, or YouTube video ID
  alt?: string;
}

interface LightboxContextValue {
  open: (items: LightboxItem[], startIndex?: number) => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

/** Any component under a <LightboxProvider> can call this to pop a
 * full-screen image/video slideshow — used by the gallery, reviews, and
 * past-trip cards so every thumbnail click opens the same big viewer. */
export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error("useLightbox must be used within a LightboxProvider");
  return ctx;
}

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LightboxItem[] | null>(null);
  const [index, setIndex] = useState(0);

  const open = useCallback((newItems: LightboxItem[], startIndex = 0) => {
    setItems(newItems);
    setIndex(startIndex);
  }, []);
  const close = useCallback(() => setItems(null), []);
  const next = useCallback(() => setIndex((i) => (items ? (i + 1) % items.length : 0)), [items]);
  const prev = useCallback(() => setIndex((i) => (items ? (i - 1 + items.length) % items.length : 0)), [items]);

  useEffect(() => {
    if (!items) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [items, close, next, prev]);

  const current = items?.[index];

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      {current && items && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous"
                className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next"
                className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          <div className="relative h-full max-h-[85vh] w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {current.type === "youtube" ? (
              <iframe
                className="h-full w-full rounded-lg"
                src={`https://www.youtube-nocookie.com/embed/${current.src}?autoplay=1`}
                title={current.alt ?? "Video"}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <Image src={current.src} alt={current.alt ?? ""} fill sizes="90vw" className="object-contain" />
            )}
          </div>
          {items.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
              {index + 1} / {items.length}
            </div>
          )}
        </div>
      )}
    </LightboxContext.Provider>
  );
}
