"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useReducedMotion } from "framer-motion";

function isInternalLink(href: string | null, pathname: string) {
  if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:")) {
    return false;
  }
  const url = new URL(href, window.location.origin);
  const target = `${url.pathname}${url.search}`;
  const current =
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : pathname;
  return target !== current;
}

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (reduce) return;

    function onClick(e: MouseEvent) {
      const target = e.target as Element | null;
      const anchor = target?.closest("a");
      if (!anchor || anchor.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey) {
        return;
      }
      const href = anchor.getAttribute("href");
      if (isInternalLink(href, pathname)) {
        setActive(true);
      }
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, reduce]);

  if (reduce || !active) return null;

  return (
    <div className="nav-progress" aria-hidden>
      <div className="nav-progress-bar" />
    </div>
  );
}
