import { cn } from "@/lib/utils";

interface AboutSectionHeadingProps {
  title: string;
  caption?: string;
  className?: string;
}

export function AboutSectionHeading({
  title,
  caption,
  className,
}: AboutSectionHeadingProps) {
  return (
    <div className={cn(className)}>
      <div className="flex items-center gap-3">
        <span
          className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-coral)] shadow-[0_0_0_3px_rgba(213,85,89,0.15)]"
          aria-hidden
        />
        <h2 className="text-base font-bold tracking-tight text-[var(--color-foreground)] sm:text-lg">
          {title}
        </h2>
      </div>
      {caption && (
        <p className="mt-2 max-w-xl pl-5 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {caption}
        </p>
      )}
    </div>
  );
}
