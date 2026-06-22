"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/i18n/locale-context";

const STORAGE_KEY = "isabel-intro-seen";
const EASE = [0.76, 0, 0.24, 1] as const;

function SplitLine({ text, delay }: { text: string; delay: number }) {
  const reduce = useReducedMotion();

  return (
    <div className="overflow-hidden">
      <motion.p
        className="intro-line text-[clamp(2rem,8vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-black"
        initial={reduce ? false : { y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.85, delay, ease: EASE }}
      >
        {text}
      </motion.p>
    </div>
  );
}

export function IntroSplash() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<"enter" | "exit">("enter");

  useEffect(() => {
    if (reduce) {
      window.dispatchEvent(new Event("isabel:intro-complete"));
      return;
    }

    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (seen) {
      window.dispatchEvent(new Event("isabel:intro-complete"));
      return;
    }

    setShow(true);
    document.body.classList.add("intro-locked");

    const exitTimer = window.setTimeout(() => setPhase("exit"), 2200);

    return () => {
      window.clearTimeout(exitTimer);
      document.body.classList.remove("intro-locked");
    };
  }, [reduce]);

  function handleExitComplete() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    document.body.classList.remove("intro-locked");
    setShow(false);
    window.dispatchEvent(new Event("isabel:intro-complete"));
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="intro-overlay"
          initial={{ clipPath: "inset(0 0 0 0)" }}
          animate={
            phase === "exit"
              ? { clipPath: "inset(0 0 100% 0)" }
              : { clipPath: "inset(0 0 0 0)" }
          }
          transition={{ duration: 1.05, ease: EASE }}
          onAnimationComplete={() => {
            if (phase === "exit") handleExitComplete();
          }}
        >
          <div className="paper-base !z-0" aria-hidden />
          <div className="paper-grain !z-[1]" aria-hidden />

          <div className="relative z-[2] flex min-h-screen flex-col items-center justify-center px-6 text-center">
            <div className="space-y-1 sm:space-y-2">
              <SplitLine text={dict.intro.line1} delay={0.35} />
              <SplitLine text={dict.intro.line2} delay={0.72} />
            </div>

            <motion.div
              className="absolute bottom-12 left-1/2 h-[2px] w-12 -translate-x-1/2 bg-[var(--color-accent)]"
              initial={reduce ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 1.1, ease: EASE }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
