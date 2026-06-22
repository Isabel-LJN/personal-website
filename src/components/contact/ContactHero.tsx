import type { Dictionary } from "@/i18n/types";

interface ContactHeroProps {
  dict: Dictionary;
}

export function ContactHero({ dict }: ContactHeroProps) {
  const { contact } = dict;

  return (
    <section className="pt-10 pb-8 sm:pt-12 sm:pb-10">
      <div className="editorial-container">
        <div className="max-w-2xl">
          <p className="aw-label mb-4">{contact.subtitle}</p>
          <h1 className="aw-headline text-balance">{contact.title}</h1>
          <div
            className="mt-5 h-[2px] w-12 bg-[var(--color-accent)]"
            aria-hidden
          />
          <p className="aw-body mt-6 max-w-lg text-balance">
            {contact.description}
          </p>
        </div>
      </div>
    </section>
  );
}
