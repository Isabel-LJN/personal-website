"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TvShowItem } from "@/i18n/types";

interface TvShowCarouselProps {
  label: string;
  items: TvShowItem[];
}

export function TvShowCarousel({ label, items }: TvShowCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows, items.length]);

  const scroll = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-tv-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
    window.setTimeout(updateArrows, 380);
  };

  return (
    <div className="mt-10 sm:mt-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <p className="aw-label text-[var(--color-text-dim)]">{label}</p>
        <div className="flex shrink-0 gap-2">
          <CarouselButton
            direction="prev"
            disabled={!canPrev}
            onClick={() => scroll(-1)}
          />
          <CarouselButton
            direction="next"
            disabled={!canNext}
            onClick={() => scroll(1)}
          />
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateArrows}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-8 sm:gap-5 sm:px-8 lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((show) => (
          <article
            key={show.id}
            data-tv-card
            className="w-[min(78vw,300px)] shrink-0 snap-start sm:w-[320px]"
          >
            <div
              className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl p-6 shadow-[0_12px_40px_rgba(0,0,0,0.1)] sm:p-7"
              style={{
                background: `linear-gradient(145deg, ${show.accent} 0%, ${show.accentEnd} 100%)`,
              }}
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55">
                {show.tags}
              </span>
              <div>
                <h3 className="text-[clamp(1.35rem,4vw,1.75rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white">
                  {show.title}
                </h3>
                <p className="mt-2 text-xs font-medium tracking-wide text-white/70">
                  {show.subtitle}
                </p>
              </div>
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                aria-hidden
              />
            </div>
            <p className="mt-3 text-sm font-semibold text-[var(--color-foreground)]">
              {show.title}
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-text-dim)]">
              {show.tags}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function CarouselButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border bg-white transition-all duration-200",
        disabled
          ? "cursor-default border-[var(--color-border)] text-[var(--color-text-dim)]/35"
          : "border-[#D55559]/30 text-[#D55559] hover:border-[#D55559] hover:bg-[#D55559] hover:text-white"
      )}
    >
      <ChevronIcon direction={direction} />
    </button>
  );
}

function ChevronIcon({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      className={cn(direction === "next" && "rotate-180")}
    >
      <path
        d="M8.5 3L4 7l4.5 4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
