import { Badge } from "@/components/ui/Badge";
import { QuickCopyMockups } from "@/components/works/QuickCopyMockups";
import type { Dictionary } from "@/i18n/types";

interface QuickCopyShowcaseProps {
  dict: Dictionary;
}

export function QuickCopyShowcase({ dict }: QuickCopyShowcaseProps) {
  const { quickcopy: qc } = dict.works;

  return (
    <div className="space-y-16 lg:space-y-24">
      <div className="flex flex-wrap gap-2">
          <Badge variant="accent">{dict.works.statusUnreleased}</Badge>
        {qc.stack.map((tech) => (
          <Badge key={tech} variant="outline">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-10">
        {([qc.story.problem, qc.story.need, qc.story.build] as const).map(
          (block, i) => (
            <article
              key={block.title}
              className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/50 p-6"
            >
              <p className="aw-label mb-3 text-[var(--color-text-dim)]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mb-3 text-lg font-bold text-[var(--color-foreground)]">
                {block.title}
              </h3>
              <p className="aw-body text-sm leading-relaxed">{block.body}</p>
            </article>
          )
        )}
      </div>

      <div>
        <h3 className="mb-6 text-lg font-bold text-[var(--color-foreground)]">
          {qc.featuresTitle}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {qc.features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-[var(--color-border)] p-5 transition-colors hover:border-[var(--color-foreground)]/20"
            >
              <h4 className="mb-2 font-semibold text-[var(--color-foreground)]">
                {feature.title}
              </h4>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-accent)]/10 p-6 lg:p-8">
        <h3 className="mb-3 text-lg font-bold text-[var(--color-foreground)]">
          {qc.widget.title}
        </h3>
        <p className="aw-body max-w-3xl leading-relaxed">{qc.widget.body}</p>
      </article>

      <QuickCopyMockups
        label={qc.prototypesLabel}
        prototypes={qc.prototypes}
      />
    </div>
  );
}
