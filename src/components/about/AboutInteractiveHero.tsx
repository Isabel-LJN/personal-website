"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AboutProfileScene } from "@/components/about/AboutProfileScene";
import { PronounceButton } from "@/components/ui/PronounceButton";
import type { PersonalFact } from "@/i18n/types";

interface AboutInteractiveHeroProps {
  subtitle: string;
  title: string;
  facts: PersonalFact[];
  pronounceLabel: string;
  pokeHint: string;
}

export function AboutInteractiveHero({
  subtitle,
  title,
  facts,
  pronounceLabel,
  pokeHint,
}: AboutInteractiveHeroProps) {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className="pt-10 pb-10 sm:pt-12 sm:pb-12">
      <div className="editorial-container">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
        >
          <p className="page-header-label page-header-label--coral mb-5">
            <span
              className="page-header-dot--coral h-1.5 w-1.5 shrink-0 rounded-full"
              aria-hidden
            />
            {subtitle}
          </p>
          <h1 className="aw-page-title text-balance">{title}</h1>
          <div
            className="mt-5 h-[2px] w-12 bg-[var(--color-accent)]"
            aria-hidden
          />
        </motion.div>

        <div
          ref={trackRef}
          className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-6"
        >
          <motion.dl
            className="min-w-0 flex-1 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 lg:max-w-2xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
          >
            {facts.map((fact, index) => (
              <motion.div
                key={fact.id}
                className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-10 sm:px-6 sm:py-[1.125rem] not-first:border-t not-first:border-[var(--color-border)]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: reduce ? 0 : 0.12 + index * 0.04,
                  ease,
                }}
              >
                <dt className="shrink-0 text-[11px] font-medium tracking-wide text-[var(--color-text-dim)] sm:w-[5.5rem] lg:w-28">
                  {fact.label}
                </dt>
                <dd className="min-w-0">
                  <div className="flex items-center gap-2">
                    {fact.href ? (
                      <a
                        href={fact.href}
                        className="text-sm font-semibold leading-snug text-[var(--color-foreground)] underline decoration-[var(--color-coral)]/35 underline-offset-2 transition-colors hover:text-[var(--color-coral)] sm:text-[15px]"
                      >
                        {fact.value}
                      </a>
                    ) : (
                      <span className="text-sm font-semibold leading-snug text-[var(--color-foreground)] sm:text-[15px]">
                        {fact.value}
                      </span>
                    )}
                    {fact.pronounce && (
                      <PronounceButton
                        text={fact.pronounce}
                        label={pronounceLabel}
                      />
                    )}
                  </div>
                </dd>
              </motion.div>
            ))}
          </motion.dl>

          <motion.div
            className="hidden min-h-0 shrink-0 lg:block lg:w-[240px] xl:w-[280px]"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.18, ease }}
          >
            <AboutProfileScene
              trackRef={trackRef}
              pokeHint={pokeHint}
              className="h-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
