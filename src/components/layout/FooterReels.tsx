"use client";

import { SlotReel } from "@/components/layout/SlotReel";

interface FooterReelsProps {
  reels: string[];
}

export function FooterReels({ reels }: FooterReelsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {reels.map((label) => (
        <SlotReel key={label} text={label} variant="light" />
      ))}
    </div>
  );
}
