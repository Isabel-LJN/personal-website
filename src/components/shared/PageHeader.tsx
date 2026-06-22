import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  label?: string;
  description?: string;
  className?: string;
  showDivider?: boolean;
}

export function PageHeader({
  title,
  label,
  description,
  className,
  showDivider = true,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "pt-10 pb-10 sm:pt-12 sm:pb-12 lg:pt-14 lg:pb-14",
        showDivider && "border-b border-[var(--color-border)]",
        className
      )}
    >
      <div className="editorial-container">
        {label && <p className="aw-label mb-6">{label}</p>}
        <h1 className="aw-title max-w-[16ch] text-balance">{title}</h1>
        {description && (
          <p className="aw-body mt-8 max-w-xl text-balance">{description}</p>
        )}
      </div>
    </section>
  );
}
