import { Button } from "@/components/ui/Button";import { WorksProjectGrid } from "@/components/works/WorksProjectGrid";
import { localizedPath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";

interface FeaturedProjectsProps {
  locale: Locale;
  dict: Dictionary;
}

export function FeaturedProjects({ locale, dict }: FeaturedProjectsProps) {
  const { projects } = dict.home;

  return (
    <section id="projects" className="section-spacing">
      <div className="editorial-container">
        <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="aw-label mb-3">{projects.label}</p>
            <h2 className="aw-headline">{projects.title}</h2>
            <p className="aw-body mt-3 max-w-md text-sm">{projects.description}</p>
          </div>
          <Button
            href={localizedPath(locale, "/works")}
            variant="outline"
            size="sm"
            className="shrink-0 self-start"
          >
            {dict.works.viewAllWorks}
          </Button>
        </div>

        <WorksProjectGrid locale={locale} dict={dict} />
      </div>
    </section>
  );
}
