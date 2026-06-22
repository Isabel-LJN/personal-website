"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

interface ParticleTypographyTitleLazyProps {
  title: string;
  className?: string;
  titleClassName?: string;
  hiddenWords?: string[];
}

const ParticleTypographyTitle = dynamic(
  () =>
    import("./ParticleTypographyTitle").then((m) => m.ParticleTypographyTitle),
  { ssr: false }
);

export function ParticleTypographyTitleLazy({
  title,
  className,
  titleClassName,
  hiddenWords,
}: ParticleTypographyTitleLazyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <h1
        className={cn(
          "aw-title max-w-[16ch] text-balance",
          titleClassName,
          className
        )}
      >
        {title}
      </h1>
    );
  }

  return (
    <ParticleTypographyTitle
      title={title}
      className={className}
      titleClassName={titleClassName}
      hiddenWords={hiddenWords}
    />
  );
}
