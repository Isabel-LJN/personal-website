"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const COLORS = {
  coral: "#D55559",
  accent: "#F1E500",
  deep: "#1E2A5A",
  ocean: "#2E6BFF",
  violet: "#7B5CFF",
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface Pointer {
  x: number;
  y: number;
}

function drawOrbitRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  rotation: number,
  color: string,
  dashed = false
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  if (dashed) ctx.setLineDash([4, 8]);
  ctx.stroke();
  ctx.restore();
}

function drawOrb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  stops: [string, string, string]
) {
  const grad = ctx.createRadialGradient(
    x - radius * 0.3,
    y - radius * 0.35,
    radius * 0.1,
    x,
    y,
    radius
  );
  grad.addColorStop(0, stops[0]);
  grad.addColorStop(0.6, stops[1]);
  grad.addColorStop(1, stops[2]);

  ctx.save();
  ctx.shadowColor = "rgba(30, 42, 90, 0.18)";
  ctx.shadowBlur = radius * 0.5;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();
}

interface AboutProfileSceneProps {
  className?: string;
  trackRef?: RefObject<HTMLElement | null>;
}

export function AboutProfileScene({
  className,
  trackRef,
}: AboutProfileSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const pointerRef = useRef<Pointer>({ x: 0.5, y: 0.5 });
  const smoothRef = useRef<Pointer>({ x: 0.5, y: 0.5 });
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const trackEl = trackRef?.current ?? container;

    const onPointer = (clientX: number, clientY: number) => {
      const rect = trackEl.getBoundingClientRect();
      pointerRef.current = {
        x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
        y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
      };
    };

    const draw = () => {
      time += reduce ? 0.003 : 0.01;
      smoothRef.current.x = lerp(
        smoothRef.current.x,
        pointerRef.current.x,
        reduce ? 1 : 0.06
      );
      smoothRef.current.y = lerp(
        smoothRef.current.y,
        pointerRef.current.y,
        reduce ? 1 : 0.06
      );

      const mx = smoothRef.current.x;
      const my = smoothRef.current.y;
      const dx = (mx - 0.5) * 2;
      const dy = (my - 0.5) * 2;

      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, "rgba(250, 248, 244, 0.95)");
      bg.addColorStop(0.55, "rgba(240, 236, 228, 0.7)");
      bg.addColorStop(1, "rgba(232, 228, 220, 0.85)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const glowX = width * mx;
      const glowY = height * my;
      const glow = ctx.createRadialGradient(
        glowX,
        glowY,
        0,
        glowX,
        glowY,
        Math.max(width, height) * 0.55
      );
      glow.addColorStop(0, "rgba(241, 229, 0, 0.14)");
      glow.addColorStop(0.45, "rgba(213, 85, 89, 0.07)");
      glow.addColorStop(1, "rgba(250, 248, 244, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 20; i++) {
        const px =
          ((width * 0.41 * (i + 1) * 73) % width) + dx * (8 + (i % 4) * 3);
        const py =
          ((height * 0.55 * (i + 1) * 47) % height) + dy * (6 + (i % 3) * 2);
        ctx.beginPath();
        ctx.arc(px, py, (i % 3) * 0.4 + 0.5, 0, Math.PI * 2);
        ctx.fillStyle =
          i % 5 === 0 ? "rgba(241, 229, 0, 0.35)" : "rgba(30, 42, 90, 0.12)";
        ctx.fill();
      }

      const cx = width * (0.5 + dx * 0.1);
      const cy = height * (0.46 + dy * 0.08);
      const orbitTilt = 0.72 + dy * 0.12;
      const orbitSpin = time * 0.3 + dx * 0.6;
      const base = Math.min(width, height);

      drawOrbitRing(
        ctx,
        cx,
        cy,
        base * 0.38,
        base * 0.14 * orbitTilt,
        orbitSpin,
        "rgba(46, 107, 255, 0.28)"
      );
      drawOrbitRing(
        ctx,
        cx,
        cy,
        base * 0.28,
        base * 0.1 * orbitTilt,
        -orbitSpin * 0.65 + 0.5,
        "rgba(213, 85, 89, 0.32)",
        true
      );

      const mainR = base * 0.16;
      drawOrb(ctx, cx, cy, mainR, ["#FFD56B", COLORS.coral, "#8E2E45"]);

      const satellites = [
        {
          angle: time * 0.95 + dx * 1.1,
          dist: base * 0.32,
          ry: base * 0.12 * orbitTilt,
          r: mainR * 0.24,
          colors: [COLORS.accent, COLORS.ocean, COLORS.deep] as [
            string,
            string,
            string,
          ],
        },
        {
          angle: -time * 0.75 + Math.PI + dy * 0.8,
          dist: base * 0.22,
          ry: base * 0.09 * orbitTilt,
          r: mainR * 0.15,
          colors: [COLORS.violet, "#4A3AFF", COLORS.deep] as [
            string,
            string,
            string,
          ],
        },
      ];

      for (const sat of satellites) {
        const sx = cx + Math.cos(sat.angle) * sat.dist;
        const sy = cy + Math.sin(sat.angle) * sat.ry;
        drawOrb(ctx, sx, sy, sat.r, sat.colors);
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onMouseMove = (e: MouseEvent) => onPointer(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onPointer(t.clientX, t.clientY);
    };

    trackEl.addEventListener("mousemove", onMouseMove);
    trackEl.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      trackEl.removeEventListener("mousemove", onMouseMove);
      trackEl.removeEventListener("touchmove", onTouchMove);
    };
  }, [reduce, trackRef]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "about-profile-scene relative min-h-[280px] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/30",
        className
      )}
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
