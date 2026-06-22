import type { PersonalProfile } from "@/i18n/types";
import { Reveal } from "@/components/motion/Reveal";
import { TvShowCarousel } from "@/components/about/TvShowCarousel";
import { TravelFootprintSection } from "@/components/about/TravelFootprintSection";
import { HobbiesSection } from "@/components/about/HobbiesSection";
import { MovieCarousel } from "@/components/about/MovieCarousel";

interface PersonalSectionProps {
  personal: PersonalProfile;
}

export function PersonalSection({ personal }: PersonalSectionProps) {
  return (
    <section className="pb-16 lg:pb-24">
      <div className="editorial-container">
        <Reveal className="mb-10 max-w-2xl">
          <p className="text-lg font-medium leading-relaxed text-[var(--color-foreground)] sm:text-xl">
            {personal.slogan}
          </p>
          <p className="aw-body mt-4">{personal.intro}</p>
        </Reveal>

        <HobbiesSection
          label={personal.labels.hobbies}
          caption={personal.hobbiesCaption}
          items={personal.hobbyItems}
        />

        <MovieCarousel
          label={personal.labels.movies}
          caption={personal.moviesCaption}
          items={personal.movieItems}
        />

        <TvShowCarousel
          label={personal.labels.tvShows}
          items={personal.tvShowItems}
        />

        <TravelFootprintSection footprint={personal.travelFootprint} />
      </div>
    </section>
  );
}
