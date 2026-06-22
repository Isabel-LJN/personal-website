"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { HobbyItem } from "@/i18n/types";
import { Reveal } from "@/components/motion/Reveal";
import { AboutSectionHeading } from "@/components/about/AboutSectionHeading";

interface HobbiesSectionProps {
  label: string;
  caption: string;
  items: HobbyItem[];
}

export function HobbiesSection({ label, caption, items }: HobbiesSectionProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  const active = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <Reveal className="mt-10 sm:mt-12">
      <AboutSectionHeading title={label} caption={caption} className="mb-5" />

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/30">
        <div className="flex flex-wrap gap-2 border-b border-[var(--color-border)] p-4 sm:gap-2.5 sm:p-5">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={cn(
                "rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200",
                activeId === item.id
                  ? "border-transparent text-white shadow-md"
                  : "border-[var(--color-border)] bg-[var(--color-surface)]/60 text-[var(--color-text-secondary)] hover:border-[var(--color-coral)]/30 hover:text-[var(--color-foreground)]"
              )}
              style={
                activeId === item.id
                  ? {
                      background: `linear-gradient(135deg, ${item.accent} 0%, ${item.accentEnd} 100%)`,
                    }
                  : undefined
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        {active && (
          <div className="relative overflow-hidden p-5 sm:p-6">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                background: `linear-gradient(135deg, ${active.accent} 0%, ${active.accentEnd} 100%)`,
              }}
              aria-hidden
            />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_10px_currentColor]"
                  style={{ color: active.accent, backgroundColor: active.accent }}
                  aria-hidden
                />
                <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
                  {active.label}
                </h3>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-[15px]">
                {active.note}
              </p>
            </div>
          </div>
        )}
      </div>
    </Reveal>
  );
}
