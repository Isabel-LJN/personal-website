import type { PersonalProfile } from "@/i18n/types";
import { Reveal } from "@/components/motion/Reveal";
import { TvShowCarousel } from "@/components/about/TvShowCarousel";

interface PersonalSectionProps {
  personal: PersonalProfile;
}

export function PersonalSection({ personal }: PersonalSectionProps) {
  const rows = [
    { label: personal.labels.hobbies, value: personal.hobbies },
    { label: personal.labels.cities, value: personal.cities },
    { label: personal.labels.movies, value: personal.movies },
  ];

  return (
    <section className="pb-16 lg:pb-24">
      <div className="editorial-container">
        <Reveal className="mb-10 max-w-2xl">
          <p className="text-lg font-medium leading-relaxed text-[var(--color-foreground)] sm:text-xl">
            {personal.slogan}
          </p>
          <p className="aw-body mt-4">{personal.intro}</p>
        </Reveal>

        <TvShowCarousel
          label={personal.labels.tvShows}
          items={personal.tvShowItems}
        />

        <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
          {rows.map((row) => (
            <div
              key={row.label}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-5 sm:p-6"
            >
              <p className="aw-label mb-2 text-[var(--color-text-dim)]">
                {row.label}
              </p>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-[15px]">
                {row.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
