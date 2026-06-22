import { cn } from "@/lib/utils";
import Link from "next/link";
import { type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  accent:
    "bg-[var(--color-accent)] text-black border border-[var(--color-accent)] hover:bg-[var(--color-accent-hover)]",
  primary:
    "bg-black text-white border border-black hover:bg-[#333]",
  secondary:
    "bg-white text-black border border-[var(--color-border)] hover:border-black",
  ghost: "text-[var(--color-text-secondary)] hover:text-black bg-transparent",
  outline:
    "bg-transparent text-black border border-[var(--color-border)] hover:border-black",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[10px] tracking-[0.12em] rounded-full",
  md: "px-6 py-2.5 text-[11px] tracking-[0.12em] rounded-full",
  lg: "px-8 py-3.5 text-[11px] tracking-[0.15em] rounded-full",
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkButtonProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: ButtonProps | LinkButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-semibold uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 disabled:pointer-events-none disabled:opacity-40",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    const isExternal = href.startsWith("http");
    const linkProps = props as Omit<LinkButtonProps, keyof BaseProps | "href">;

    if (isExternal) {
      return (
        <a href={href} className={classes} {...linkProps}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonProps)}>
      {children}
    </button>
  );
}
