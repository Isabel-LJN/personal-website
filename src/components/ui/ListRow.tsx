"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ListRowProps {
  href?: string;
  external?: boolean;
  index: number;
  label: string;
  title: string;
  subtitle?: string;
  meta?: string;
  image?: string;
  actionLabel?: string;
  className?: string;
}

export function ListRow({
  href,
  external,
  index,
  label,
  title,
  subtitle,
  meta,
  image,
  actionLabel = "View",
  className,
}: ListRowProps) {
  const reduce = useReducedMotion();

  const body = (
    <div className="grid gap-4 border-b border-[var(--color-border)] py-5 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-6 sm:py-6">
      <div className="flex items-start gap-4 sm:items-center">
        <span className="aw-label w-6 shrink-0 pt-0.5 text-[var(--color-text-dim)] sm:pt-0">
          {String(index).padStart(2, "0")}
        </span>
        {image && (
          <div className="relative h-14 w-20 shrink-0 overflow-hidden bg-[var(--color-surface)] sm:h-16 sm:w-24">
            <Image
              src={image}
              alt=""
              fill
              className="aw-card-image object-cover"
              sizes="96px"
            />
          </div>
        )}
      </div>

      <div className="min-w-0 pl-10 sm:pl-0">
        <p className="aw-label mb-1.5 text-[var(--color-text-dim)]">{label}</p>
        <h3 className="text-base font-bold uppercase tracking-[-0.02em] text-[var(--color-foreground)] transition-colors duration-300 group-hover:text-[var(--color-text-secondary)] sm:text-lg">
          {title}
        </h3>
        {subtitle && (
          <p className="aw-body mt-2 line-clamp-2 max-w-2xl text-sm">{subtitle}</p>
        )}
        {meta && (
          <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--color-text-dim)]">
            {meta}
          </p>
        )}
      </div>

      <span className="aw-label hidden items-center gap-2 self-center text-[var(--color-foreground)] transition-transform duration-500 group-hover:translate-x-0.5 sm:inline-flex">
        {actionLabel}
        <span aria-hidden>→</span>
      </span>
    </div>
  );

  const classes = cn("group block", className);

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
        >
          {body}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {body}
      </Link>
    );
  }

  return (
    <motion.article
      className={classes}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {body}
    </motion.article>
  );
}

/** @deprecated use ListRow */
export const NomineeCard = ListRow;
