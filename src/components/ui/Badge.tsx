import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-black/5 text-[var(--color-text-secondary)]",
  accent: "bg-[var(--color-accent)] text-black",
  outline: "border border-[var(--color-border)] text-[var(--color-text-dim)]",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
