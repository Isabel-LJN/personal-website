"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AboutCosmicScene } from "@/components/about/AboutCosmicScene";
import { PronounceButton } from "@/components/ui/PronounceButton";
import type { PersonalFact } from "@/i18n/types";

interface AboutInteractiveHeroProps {
  title: string;
  facts: PersonalFact[];
  pronounceLabel: string;
}

export function AboutInteractiveHero({
  title,
  facts,
  pronounceLabel,
}: AboutInteractiveHeroProps) {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="pt-10 pb-10 sm:pt-12 sm:pb-12">
      <div className="editorial-container">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease }}
          >
            <h1 className="aw-headline text-balance">{title}</h1>
          </motion.div>
        </div>

        <motion.ul
          className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
        >
          {facts.map((fact, index) => (
            <motion.li
              key={fact.id}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-5 py-4 backdrop-blur-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 + index * 0.05, ease }}
            >
              <p className="aw-label mb-1.5 text-[var(--color-text-dim)]">
                {fact.label}
              </p>
              <div className="flex items-center gap-2">
                {fact.href ? (
                  <a
                    href={fact.href}
                    className="text-sm font-semibold leading-snug text-[var(--color-foreground)] underline decoration-[var(--color-coral)]/35 underline-offset-2 transition-colors hover:text-[var(--color-coral)] sm:text-[15px]"
                  >
                    {fact.value}
                  </a>
                ) : (
                  <p className="text-sm font-semibold leading-snug text-[var(--color-foreground)] sm:text-[15px]">
                    {fact.value}
                  </p>
                )}
                {fact.pronounce && (
                  <PronounceButton
                    text={fact.pronounce}
                    label={pronounceLabel}
                  />
                )}
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          className="mt-10 max-w-4xl sm:mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.75,
            delay: reduce ? 0 : 0.28,
            ease,
          }}
        >
          <AboutCosmicScene />
        </motion.div>
      </div>
    </section>
  );
}
