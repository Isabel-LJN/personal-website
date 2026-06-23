"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ParticleTypographyTitleLazy } from "@/components/ui/ParticleTypographyTitleLazy";
import { WritingInkSceneLazy } from "@/components/blog/WritingInkSceneLazy";
import { cn } from "@/lib/utils";

type PageHeaderAccent = "coral" | "ocean" | "violet";

interface WritingPageHeroProps {
  label: string;
  title: string;
  description: string;
  accent?: PageHeaderAccent;
  hiddenWords?: string[];
  className?: string;
}

export function WritingPageHero({
  label,
  title,
  description,
  accent = "coral",
  hiddenWords,
  className,
}: WritingPageHeroProps) {
  const reduce = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <section className={cn("pt-10 pb-8 sm:pt-12 sm:pb-10", className)}>
      <div className="editorial-container">
        <div
          ref={trackRef}
          className="relative min-h-[300px] lg:min-h-[360px]"
        >
          <motion.div
            className="pointer-events-none absolute inset-0 hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: reduce ? 0 : 0.1, ease }}
          >
            <div className="pointer-events-none h-full">
              <WritingInkSceneLazy
                trackRef={trackRef}
                className="h-full min-h-[300px] lg:min-h-[360px]"
              />
            </div>
          </motion.div>

          <motion.div
            className="pointer-events-none relative z-10 max-w-md pt-2 xl:max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease }}
          >
            <p
              className={cn(
                "page-header-label mb-5",
                accent === "coral" && "page-header-label--coral",
                accent === "ocean" && "page-header-label--ocean",
                accent === "violet" && "page-header-label--violet"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full",
                  accent === "coral" && "page-header-dot--coral",
                  accent === "ocean" && "page-header-dot--ocean",
                  accent === "violet" && "page-header-dot--violet"
                )}
                aria-hidden
              />
              {label}
            </p>

            <div className="pointer-events-auto">
              <ParticleTypographyTitleLazy
                title={title}
                titleClassName="aw-page-title text-balance"
                hiddenWords={hiddenWords}
              />
            </div>

            <div
              className="mt-5 h-[2px] w-12 bg-[var(--color-accent)]"
              aria-hidden
            />

            <p className="aw-body mt-5 max-w-sm text-balance">{description}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
