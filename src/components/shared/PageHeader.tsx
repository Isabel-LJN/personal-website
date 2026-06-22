import { cn } from "@/lib/utils";
import { ParticleTypographyTitleLazy } from "@/components/ui/ParticleTypographyTitleLazy";

type PageHeaderAccent = "coral" | "ocean" | "violet";

interface PageHeaderProps {
  title: string;
  label?: string;
  description?: string;
  className?: string;
  showDivider?: boolean;
  accent?: PageHeaderAccent;
  interactiveTitle?: boolean;
  hiddenWords?: string[];
}

const titleClass = "aw-page-title max-w-2xl text-balance";

export function PageHeader({
  title,
  label,
  description,
  className,
  showDivider = false,
  accent = "coral",
  interactiveTitle = false,
  hiddenWords,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "pt-10 pb-8 sm:pt-12 sm:pb-10",
        showDivider && "border-b border-[var(--color-border)]",
        className
      )}
    >
      <div className="editorial-container">
        {label && (
          <p
            className={cn(
              "page-header-label mb-5",
              accent === "coral" && "page-header-label--coral",
              accent === "ocean" && "page-header-label--ocean",
              accent === "violet" && "page-header-label--violet"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 shrink-0 rounded-full",
                accent === "coral" && "page-header-dot--coral",
                accent === "ocean" && "page-header-dot--ocean",
                accent === "violet" && "page-header-dot--violet"
              )}
              aria-hidden
            />
            {label}
          </p>
        )}

        {interactiveTitle ? (
          <ParticleTypographyTitleLazy
            title={title}
            titleClassName={titleClass}
          />
        ) : (
          <h1 className={titleClass}>{title}</h1>
        )}

        {description && (
          <p className="aw-body mt-5 max-w-xl text-balance">{description}</p>
        )}
      </div>
    </section>
  );
}
