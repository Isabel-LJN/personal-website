"use client";

import { useEffect, useState, type RefObject } from "react";
import dynamic from "next/dynamic";

const WritingInkScene = dynamic(
  () => import("./WritingInkScene").then((m) => m.WritingInkScene),
  { ssr: false }
);

interface WritingInkSceneLazyProps {
  className?: string;
  trackRef?: RefObject<HTMLElement | null>;
}

export function WritingInkSceneLazy(props: WritingInkSceneLazyProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={props.className} aria-hidden />;
  }

  return <WritingInkScene {...props} />;
}
