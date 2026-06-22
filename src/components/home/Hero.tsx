"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroFluidField } from "@/components/home/HeroFluidField";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

interface HeroProps {
  locale: Locale;
  dict: Dictionary;
}

function introAlreadySeen(): boolean {
  if (typeof window === "undefined") return true;
  return sessionStorage.getItem("isabel-intro-seen") === "1";
}

export function Hero({ locale, dict }: HeroProps) {
  const { hero } = dict.home;
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(reduce);
  const ease = [0.76, 0, 0.24, 1] as const;
  const today = new Date().toLocaleDateString(
    locale === "zh" ? "zh-CN" : "en-US",
    { month: "short", day: "numeric", year: "numeric" }
  );

  useEffect(() => {
    if (reduce || introAlreadySeen()) {
      setReady(true);
      return;
    }

    function onIntroDone() {
      setReady(true);
    }

    window.addEventListener("isabel:intro-complete", onIntroDone);
    return () => window.removeEventListener("isabel:intro-complete", onIntroDone);
  }, [reduce]);

  return (
    <section
      className="hero-section relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-5 pb-24 pt-8 text-center sm:min-h-[calc(100vh-4rem)]"
    >
      <HeroFluidField />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          className="mb-6 flex flex-wrap items-center justify-center gap-3 aw-label text-[var(--color-text-dim)]"
          initial={false}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span>{today}</span>
          <span className="text-black/15">|</span>
          <span>{hero.greeting}</span>
        </motion.div>

        <motion.h1
          className="aw-title text-balance"
          initial={false}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease }}
        >
          {dict.meta.siteName}
        </motion.h1>

        <motion.p
          className="aw-body mx-auto mt-8 max-w-lg"
          initial={false}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.75, delay: 0.18, ease }}
        >
          {hero.subline}
        </motion.p>

        <motion.p
          className="aw-label mt-10 text-[var(--color-text-dim)]"
          initial={false}
          animate={ready ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.32, ease }}
        >
          {dict.meta.authorTagline}
        </motion.p>
      </div>
    </section>
  );
}
