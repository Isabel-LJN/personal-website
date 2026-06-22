"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

interface LiquidTypographyTitleLazyProps {
  title: string;
  className?: string;
  titleClassName?: string;
}

const LiquidTypographyTitle = dynamic(
  () =>
    import("./LiquidTypographyTitle").then((m) => m.LiquidTypographyTitle),
  { ssr: false }
);

export function LiquidTypographyTitleLazy({
  title,
  className,
  titleClassName,
}: LiquidTypographyTitleLazyProps) {
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
    <LiquidTypographyTitle
      title={title}
      className={className}
      titleClassName={titleClassName}
    />
  );
}
