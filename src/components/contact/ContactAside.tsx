import { ContactVisual } from "./ContactVisual";
import { giteeUrl } from "@/lib/seo";
import type { Dictionary } from "@/i18n/types";

interface ContactAsideProps {
  dict: Dictionary;
}

export function ContactAside({ dict }: ContactAsideProps) {
  const { contact, meta } = dict;

  return (
    <aside className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
      <ContactVisual />

      <div className="space-y-4">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-5 backdrop-blur-sm">
          <p className="aw-label mb-2">{contact.aside.emailLabel}</p>
          <a
            href={`mailto:${meta.email}`}
            className="break-all text-base font-semibold text-black transition-colors hover:text-[var(--color-text-secondary)]"
          >
            {meta.email}
          </a>
          <p className="aw-body mt-3 text-sm">{contact.aside.responseNote}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={giteeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/60 px-4 py-2 text-xs font-medium uppercase tracking-wider text-black transition-colors hover:border-black"
          >
            Gitee →
          </a>
        </div>
      </div>
    </aside>
  );
}
