import { ListRow } from "@/components/ui/ListRow";
import type { Dictionary } from "@/i18n/types";

interface OpenSourceSectionProps {
  dict: Dictionary;
}

export function OpenSourceSection({ dict }: OpenSourceSectionProps) {
  const { openSource } = dict.home;

  return (
    <section className="section-spacing aw-divider">
      <div className="editorial-container">
        <div className="mb-8">
          <p className="aw-label mb-3">{openSource.label}</p>
          <h2 className="aw-headline">{openSource.title}</h2>
          <p className="aw-body mt-3 max-w-xl text-sm">{openSource.description}</p>
        </div>

        <ListRow
          href={openSource.giteeUrl}
          external
          index={1}
          label="Open Source"
          title={openSource.giteeLabel}
          meta="Gitee · Public repos"
          actionLabel={openSource.cta}
          className="!text-[var(--color-accent)]"
        />
      </div>
    </section>
  );
}
