"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TravelFootprint, TravelCity } from "@/i18n/types";
import { Reveal } from "@/components/motion/Reveal";
import { TravelGlobeLazy } from "@/components/about/TravelGlobeLazy";

interface TravelFootprintSectionProps {
  footprint: TravelFootprint;
}

export function TravelFootprintSection({ footprint }: TravelFootprintSectionProps) {
  const reduce = useReducedMotion();
  const firstCity =
    footprint.cities.find((c) => c.visited) ?? footprint.cities[0];
  const [autoRotate, setAutoRotate] = useState(!reduce);
  const [focusCityId, setFocusCityId] = useState(firstCity.id);
  const [hoveredCity, setHoveredCity] = useState<TravelCity | null>(null);
  const [selectedCity, setSelectedCity] = useState<TravelCity | null>(firstCity);

  const visited = footprint.cities.filter((c) => c.visited);
  const wishlist = footprint.cities.filter((c) => !c.visited);
  const displayCity = hoveredCity ?? selectedCity;

  const handleCitySelect = useCallback((city: TravelCity) => {
    setSelectedCity(city);
    setFocusCityId(city.id);
    setAutoRotate(false);
  }, []);

  const handleResetView = () => {
    setFocusCityId(firstCity.id);
    setSelectedCity(firstCity);
    setHoveredCity(null);
  };

  const statItems = [
    { label: footprint.stats.cities, value: footprint.stats.citiesValue },
    { label: footprint.stats.provinces, value: footprint.stats.provincesValue },
    { label: footprint.stats.countries, value: footprint.stats.countriesValue },
    { label: footprint.stats.mileage, value: footprint.stats.mileageValue },
  ];

  return (
    <Reveal className="mt-12 sm:mt-16">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="aw-label mb-2 text-[var(--color-text-dim)]">
            {footprint.title}
          </p>
          <p className="text-base font-medium text-[var(--color-foreground)] sm:text-lg">
            {footprint.travelSlogan}
          </p>
          <p className="aw-body mt-2 max-w-xl text-sm">{footprint.caption}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAutoRotate((v) => !v)}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-coral)]/40 hover:text-[var(--color-foreground)]"
          >
            {autoRotate
              ? footprint.controls.autoRotateOff
              : footprint.controls.autoRotateOn}
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-coral)]/40 hover:text-[var(--color-foreground)]"
          >
            {footprint.controls.resetView}
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 px-4 py-3 text-center sm:px-5 sm:py-4"
          >
            <p className="text-xl font-semibold tabular-nums text-[var(--color-coral)] sm:text-2xl">
              {item.value}
            </p>
            <p className="aw-label mt-1 text-[var(--color-text-dim)]">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/30">
        <div className="grid lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_320px]">
          <div className="relative min-h-[320px] sm:min-h-[400px] lg:min-h-[480px] travel-globe-panel">
            <TravelGlobeLazy
              cities={footprint.cities}
              focusCityId={focusCityId}
              autoRotate={autoRotate}
              reducedMotion={reduce ?? false}
              onCityHover={setHoveredCity}
              onCityClick={handleCitySelect}
            />

            <p className="pointer-events-none absolute right-4 top-4 z-10 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-3 py-1.5 text-[10px] font-medium text-[var(--color-text-dim)] backdrop-blur-sm">
              {footprint.controls.globeHint}
            </p>

            <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-wrap gap-3 text-[10px] text-[var(--color-text-dim)]">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full bg-[var(--color-coral)] shadow-[0_0_6px_rgba(213,85,89,0.5)]"
                  aria-hidden
                />
                {footprint.listVisited}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-dim)]"
                  aria-hidden
                />
                {footprint.listWishlist}
              </span>
            </div>

            {displayCity && (
              <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 sm:left-6 sm:right-auto sm:max-w-xs">
                <CityTooltip city={displayCity} tooltip={footprint.tooltip} />
              </div>
            )}
          </div>

          <div className="border-t border-[var(--color-border)] lg:border-l lg:border-t-0">
            <div className="max-h-[480px] overflow-y-auto p-4 sm:p-5">
              <p className="aw-label mb-4 text-[var(--color-text-dim)]">
                {footprint.listHeading}
              </p>

              <CityListGroup
                heading={footprint.listVisited}
                cities={visited}
                selectedId={selectedCity?.id}
                onSelect={handleCitySelect}
              />

              <CityListGroup
                heading={footprint.listWishlist}
                cities={wishlist}
                selectedId={selectedCity?.id}
                onSelect={handleCitySelect}
                className="mt-5"
                dimmed
              />
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function CityTooltip({
  city,
  tooltip,
}: {
  city: TravelCity;
  tooltip: TravelFootprint["tooltip"];
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-3 shadow-lg backdrop-blur-sm sm:p-4">
      <div className="flex gap-3">
        {city.photo && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={city.photo}
              alt=""
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="font-medium text-[var(--color-foreground)]">
              {city.name}
            </p>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium",
                city.visited
                  ? "bg-[var(--color-coral)]/15 text-[var(--color-coral)]"
                  : "bg-[var(--color-border)] text-[var(--color-text-dim)]"
              )}
            >
              {city.visited ? tooltip.visited : tooltip.wishlist}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-[var(--color-text-dim)]">
            {city.province} · {city.country}
            {city.days != null && city.visited && (
              <>
                {" "}
                · {city.days} {tooltip.days}
              </>
            )}
          </p>
          {city.visitDate && city.visited && (
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {tooltip.visitDate}: {city.visitDate}
            </p>
          )}
          {city.note && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--color-text-secondary)]">
              {city.note}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CityListGroup({
  heading,
  cities,
  selectedId,
  onSelect,
  className,
  dimmed,
}: {
  heading: string;
  cities: TravelCity[];
  selectedId?: string;
  onSelect: (city: TravelCity) => void;
  className?: string;
  dimmed?: boolean;
}) {
  return (
    <div className={className}>
      <p className="mb-2 text-xs font-medium text-[var(--color-text-dim)]">
        {heading}
      </p>
      <ul className="space-y-1">
        {cities.map((city) => (
          <li key={city.id}>
            <button
              type="button"
              onClick={() => onSelect(city)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition",
                selectedId === city.id
                  ? "bg-[var(--color-coral)]/10 text-[var(--color-foreground)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]",
                dimmed && !city.visited && "opacity-70"
              )}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: city.accent ?? "#8a8578",
                  boxShadow: city.visited
                    ? `0 0 6px ${city.accent ?? "#d55559"}88`
                    : "none",
                }}
                aria-hidden
              />
              <span className="truncate">{city.name}</span>
              {city.days != null && city.visited && (
                <span className="ml-auto shrink-0 text-xs tabular-nums text-[var(--color-text-dim)]">
                  {city.days}d
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
