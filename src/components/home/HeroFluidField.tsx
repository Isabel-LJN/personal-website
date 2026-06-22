"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { HeroFluidSimulation } from "@/lib/hero-fluid-simulation";

const FORCE_SCALE = 9000;

export function HeroFluidField() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const simRef = useRef<HeroFluidSimulation | null>(null);
  const rafRef = useRef(0);
  const lastPointerRef = useRef({ x: 0, y: 0, t: 0 });

  useLayoutEffect(() => {
    let cancelled = false;
    let teardown: (() => void) | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const boot = async () => {
      const root = rootRef.current;
      const canvas = canvasRef.current;
      if (!root || !canvas || cancelled) return;

      const width = root.clientWidth;
      const height = root.clientHeight;
      if (width < 2 || height < 2) {
        retryTimer = setTimeout(boot, 50);
        return;
      }

      const THREE = await import("three");
      if (cancelled) return;

      try {
        const sim = new HeroFluidSimulation(
          THREE,
          canvas,
          width,
          height,
          { reducedMotion: reduce ?? false }
        );
        simRef.current = sim;
        sim.seedField();

        let lastFrame = performance.now();

        const loop = (now: number) => {
          const dt = (now - lastFrame) / 1000;
          lastFrame = now;
          sim.step(dt, now * 0.001);
          rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);

        const resize = () => {
          if (!rootRef.current || !simRef.current) return;
          const w = rootRef.current.clientWidth;
          const h = rootRef.current.clientHeight;
          if (w < 2 || h < 2) return;
          simRef.current.resize(w, h);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(root);

        const onPointerMove = (e: PointerEvent) => {
          const el = rootRef.current;
          const sim = simRef.current;
          if (!el || !sim) return;

          const rect = el.getBoundingClientRect();
          const inside =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

          if (!inside) {
            lastPointerRef.current.t = 0;
            return;
          }

          const x = (e.clientX - rect.left) / rect.width;
          const y = 1 - (e.clientY - rect.top) / rect.height;
          const prev = lastPointerRef.current;

          if (prev.t === 0) {
            lastPointerRef.current = { x, y, t: performance.now() };
            return;
          }

          const scale = reduce ? FORCE_SCALE * 0.35 : FORCE_SCALE;
          const dx = (x - prev.x) * scale;
          const dy = (y - prev.y) * scale;

          if (Math.abs(dx) > 0.3 || Math.abs(dy) > 0.3) {
            sim.injectForce(x, y, dx, dy);
          }

          lastPointerRef.current = { x, y, t: performance.now() };
        };

        window.addEventListener("pointermove", onPointerMove, { passive: true });

        teardown = () => {
          cancelAnimationFrame(rafRef.current);
          ro.disconnect();
          window.removeEventListener("pointermove", onPointerMove);
          sim.dispose();
          simRef.current = null;
        };
      } catch (err) {
        console.error("[HeroFluidField] WebGL init failed:", err);
      }
    };

    boot();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      teardown?.();
    };
  }, [reduce]);

  return (
    <div ref={rootRef} className="hero-fluid-field" aria-hidden>
      <canvas ref={canvasRef} className="hero-fluid-canvas" />
    </div>
  );
}
