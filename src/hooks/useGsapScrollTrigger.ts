"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface UseGsapScrollTriggerOptions {
  trigger?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean;
  markers?: boolean;
}

export function useGsapScrollTrigger(
  animationFn: (ctx: gsap.Context) => void,
  deps: unknown[] = [],
  options?: UseGsapScrollTriggerOptions
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      animationFn(ctx);
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { containerRef, options };
}

export function useGsapFadeIn(
  selector: string,
  options?: { delay?: number; stagger?: number; y?: number }
) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(selector, {
        opacity: 0,
        y: options?.y ?? 40,
        duration: 1,
        delay: options?.delay ?? 0,
        stagger: options?.stagger ?? 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [selector, options?.delay, options?.stagger, options?.y]);

  return ref;
}

export { gsap, ScrollTrigger };
