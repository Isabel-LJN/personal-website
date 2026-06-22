"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { TvShowItem } from "@/i18n/types";
import { Reveal } from "@/components/motion/Reveal";
import { AboutSectionHeading } from "@/components/about/AboutSectionHeading";

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
    <Reveal className="mt-10 sm:mt-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <AboutSectionHeading title={label} />
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
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
              <Image
                src={show.photo}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 78vw, 320px"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to top, ${show.accentEnd}ee 0%, ${show.accent}88 45%, transparent 100%)`,
                }}
              />
              <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-7">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                  {show.tags}
                </span>
                <div>
                  <h3 className="text-[clamp(1.25rem,3.8vw,1.65rem)] font-bold leading-[1.08] tracking-[-0.03em] text-white">
                    {show.title}
                  </h3>
                  <p className="mt-1.5 text-xs font-medium tracking-wide text-white/75">
                    {show.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Reveal>
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
    </button>
  );
}
