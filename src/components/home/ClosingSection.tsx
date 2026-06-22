import { Button } from "@/components/ui/Button";
import { localizedPath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import { Reveal } from "@/components/motion/Reveal";

interface ClosingSectionProps {
  locale: Locale;
  dict: Dictionary;
}

export function ClosingSection({ locale, dict }: ClosingSectionProps) {
  const { closing } = dict.home;

  return (
    <section className="section-spacing">
      <div className="editorial-container">
        <Reveal className="border border-[var(--color-border)] p-8 sm:p-12 lg:p-16">
          <h2 className="aw-headline max-w-xl text-balance">{closing.title}</h2>
          <p className="aw-body mt-6 max-w-lg">{closing.body}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={localizedPath(locale, "/contact")} size="lg">
              {closing.cta}
            </Button>
            <Button
              href={localizedPath(locale, "/about")}
              variant="outline"
              size="lg"
            >
              {closing.secondary}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
