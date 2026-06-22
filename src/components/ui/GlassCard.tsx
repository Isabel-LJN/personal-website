import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl",
        hover &&
          "transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-white/5",
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-zinc-900/50 p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
