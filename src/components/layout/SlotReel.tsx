"use client";

import { useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const SPIN_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

interface SlotReelProps {
  text: string;
  className?: string;
  variant?: "dark" | "light";
}

function randomToken(len: number) {
  return Array.from({ length: len }, () =>
    SPIN_CHARS[Math.floor(Math.random() * SPIN_CHARS.length)]
  ).join("");
}

export function SlotReel({ text, className, variant = "dark" }: SlotReelProps) {
  const reduce = useReducedMotion();
  const [spinning, setSpinning] = useState(false);
  const [items, setItems] = useState([text]);
  const [activeIndex, setActiveIndex] = useState(0);

  const spin = useCallback(() => {
    if (spinning || reduce) return;

    const fillerCount = 16 + Math.floor(Math.random() * 5);
    const strip = [
      ...Array.from({ length: fillerCount }, () => randomToken(text.length)),
      text,
    ];

    setSpinning(true);
    setItems(strip);
    setActiveIndex(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setActiveIndex(strip.length - 1);
      });
    });

    window.setTimeout(() => {
      setSpinning(false);
      setItems([text]);
      setActiveIndex(0);
    }, 1600);
  }, [spinning, reduce, text]);

  return (
    <button
      type="button"
      onClick={spin}
      disabled={spinning}
      aria-label={text}
      className={cn(
        "relative cursor-pointer select-none transition-colors disabled:cursor-default",
        variant === "dark"
          ? "min-w-[3.5rem] px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] sm:text-xs"
          : "min-w-[2.75rem]",
        variant === "dark"
          ? "text-white/50 hover:text-white/85"
          : "rounded-full border border-[var(--color-border)] bg-white/60 px-2.5 py-0.5 text-[11px] font-semibold tracking-[0.14em] text-[var(--color-text-dim)] hover:border-[var(--color-foreground)]/15 hover:bg-white hover:text-[var(--color-foreground)] sm:text-xs",
        spinning &&
          (variant === "dark" ? "text-white/75" : "text-[var(--color-foreground)]/70"),
        className
      )}
    >
      <span className="relative block h-[1.15em] overflow-hidden">
        <motion.span
          className="flex flex-col"
          animate={{ y: `calc(${-activeIndex} * 1.15em)` }}
          transition={
            spinning
              ? { duration: 1.45, ease: [0.15, 0.85, 0.25, 1] }
              : { duration: 0 }
          }
        >
          {items.map((item, i) => (
            <span
              key={`${i}-${item}`}
              className="block h-[1.15em] leading-[1.15em]"
            >
              {item}
            </span>
          ))}
        </motion.span>
      </span>
    </button>
  );
}
