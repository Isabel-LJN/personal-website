"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

interface PronounceButtonProps {
  text: string;
  lang?: string;
  label: string;
  className?: string;
}

export function PronounceButton({
  text,
  lang = "en-US",
  label,
  className,
}: PronounceButtonProps) {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.88;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [text, lang]);

  return (
    <button
      type="button"
      onClick={speak}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-coral)]/25 bg-[var(--color-coral)]/8 text-[var(--color-coral)] transition-all duration-200 hover:border-[var(--color-coral)]/45 hover:bg-[var(--color-coral)]/15 active:scale-95",
        speaking && "animate-pulse border-[var(--color-coral)]/50 bg-[var(--color-coral)]/20",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3.5 w-3.5"
        aria-hidden
      >
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        <path
          d="M15.5 8.5a5 5 0 0 1 0 7"
          className={cn(speaking && "opacity-100", !speaking && "opacity-80")}
        />
        <path
          d="M18 6a8.5 8.5 0 0 1 0 12"
          className={cn(speaking ? "opacity-100" : "opacity-50")}
        />
      </svg>
    </button>
  );
}
