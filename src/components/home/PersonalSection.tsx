import type { PersonalProfile } from "@/i18n/types";
import { TvShowCarousel } from "@/components/about/TvShowCarousel";
import { TravelFootprintSection } from "@/components/about/TravelFootprintSection";
import { HobbiesSection } from "@/components/about/HobbiesSection";
import { MovieCarousel } from "@/components/about/MovieCarousel";

interface PersonalSectionProps {
  personal: PersonalProfile;
}

export function PersonalSection({ personal }: PersonalSectionProps) {
  return (
    <section className="pb-16 pt-10 lg:pb-24 lg:pt-12">
      <div className="editorial-container">
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
