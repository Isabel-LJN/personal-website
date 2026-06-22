"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { TravelCity } from "@/i18n/types";

const TravelGlobe = dynamic(
  () => import("./TravelGlobe").then((m) => m.TravelGlobe),
  { ssr: false }
);

interface TravelGlobeLazyProps {
  cities: TravelCity[];
  focusCityId?: string | null;
  autoRotate: boolean;
  reducedMotion?: boolean;
  onCityHover?: (city: TravelCity | null) => void;
  onCityClick?: (city: TravelCity) => void;
}

export function TravelGlobeLazy(props: TravelGlobeLazyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-32 w-32 animate-pulse rounded-full bg-[var(--color-border)]" />
      </div>
    );
  }

  return <TravelGlobe {...props} />;
}
