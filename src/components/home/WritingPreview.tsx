import { Button } from "@/components/ui/Button";
import { BlogCard } from "@/components/shared/ContentCards";
import { localizedPath } from "@/i18n/config";
import type { Dictionary } from "@/i18n/types";
import type { Locale } from "@/i18n/config";
import type { BlogPost } from "@/types";
import { Reveal } from "@/components/motion/Reveal";

interface WritingPreviewProps {
  locale: Locale;
  dict: Dictionary;
  posts: BlogPost[];
}

export function WritingPreview({ locale, dict, posts }: WritingPreviewProps) {
  const { writing } = dict.home;

  return (
    <section className="section-spacing">
      <div className="editorial-container">
        <Reveal className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="aw-label mb-3">{writing.label}</p>
            <h2 className="aw-headline">{writing.title}</h2>
          </div>
          <Button
            href={`${localizedPath(locale, "/blog")}?category=cs`}
            variant="outline"
            size="sm"
            className="shrink-0 self-start"
          >
            {writing.cta}
          </Button>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} locale={locale} dict={dict} />
          ))}
        </div>
      </div>
    </section>
  );
}
