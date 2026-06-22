import type { Dictionary } from "@/i18n/types";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

interface StorySectionProps {
  dict: Dictionary;
}

export function StorySection({ dict }: StorySectionProps) {
  const { story } = dict.home;

  return (
    <section className="section-spacing aw-divider">
      <div className="editorial-container">
        <Reveal className="mb-16 max-w-2xl">
          <p className="aw-label mb-4">{story.label}</p>
          <h2 className="aw-headline text-balance">{story.title}</h2>
        </Reveal>

        <Stagger className="divide-y divide-[var(--color-border)]">
          {story.blocks.map((block) => (
            <StaggerItem key={block.id}>
              <article className="grid gap-6 py-10 sm:grid-cols-[5rem_1fr] sm:gap-12 sm:py-14">
                <span className="aw-label text-2xl font-bold text-[#333] sm:text-4xl">
                  {block.chapter}
                </span>
                <div className="max-w-2xl">
                  <h3 className="text-lg font-bold uppercase tracking-tight text-black sm:text-xl">
                    {block.title}
                  </h3>
                  <p className="aw-body mt-4">{block.body}</p>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
