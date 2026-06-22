"use client";

import { motion, useReducedMotion } from "framer-motion";
import { AboutCosmicScene } from "@/components/about/AboutCosmicScene";

interface AboutInteractiveHeroProps {
  label: string;
  title: string;
  description?: string;
}

export function AboutInteractiveHero({
  label,
  title,
  description,
}: AboutInteractiveHeroProps) {
  const reduce = useReducedMotion();

  return (
    <section className="about-hero pt-10 pb-10 sm:pt-12 sm:pb-12 lg:pt-14 lg:pb-14">
      <div className="editorial-container">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,42%)] lg:gap-10 xl:gap-14">
          <div className="relative z-10 min-w-0">
            <motion.p
              className="about-hero-label aw-label mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="about-hero-label-dot" aria-hidden />
              {label}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.75,
                delay: 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h1 className="aw-title max-w-[16ch] text-balance">{title}</h1>
            </motion.div>

            {description && (
              <motion.p
                className="aw-body mt-8 max-w-xl text-balance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.65,
                  delay: 0.14,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {description}
              </motion.p>
            )}
          </div>

          <motion.div
            className="relative lg:pt-6"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: reduce ? 0 : 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <AboutCosmicScene />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
