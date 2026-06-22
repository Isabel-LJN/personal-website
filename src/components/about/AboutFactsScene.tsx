"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const COLORS = {
  coral: "#D55559",
  accent: "#F1E500",
  deep: "#1E2A5A",
  ocean: "#2E6BFF",
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface Pointer {
  x: number;
  y: number;
}

function drawOrb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  stops: [string, string],
  glow = false
) {
  if (glow) {
    ctx.save();
    ctx.shadowColor = "rgba(213, 85, 89, 0.35)";
    ctx.shadowBlur = radius * 0.9;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(213, 85, 89, 0.12)";
    ctx.fill();
    ctx.restore();
  }

  const grad = ctx.createRadialGradient(
    x - radius * 0.3,
    y - radius * 0.35,
    radius * 0.1,
    x,
    y,
    radius
  );
  grad.addColorStop(0, stops[0]);
  grad.addColorStop(1, stops[1]);

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = 0.28;
  ctx.beginPath();
  ctx.ellipse(x - radius * 0.18, y - radius * 0.22, radius * 0.42, radius * 0.16, -0.6, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();
}

function drawOrbit(
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

export function AboutFactsScene() {
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

    const onPointer = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      pointerRef.current = {
        x: Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)),
        y: Math.min(1, Math.max(0, (clientY - rect.top) / rect.height)),
      };
    };

    const draw = () => {
      time += reduce ? 0.003 : 0.009;
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

      const bg = ctx.createRadialGradient(
        width * (0.45 + dx * 0.12),
        height * (0.4 + dy * 0.1),
        0,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.75
      );
      bg.addColorStop(0, "rgba(241, 229, 0, 0.14)");
      bg.addColorStop(0.45, "rgba(250, 248, 244, 0.55)");
      bg.addColorStop(1, "rgba(232, 228, 220, 0.25)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const cursorGlow = ctx.createRadialGradient(
        width * mx,
        height * my,
        0,
        width * mx,
        height * my,
        Math.min(width, height) * 0.35
      );
      cursorGlow.addColorStop(0, "rgba(213, 85, 89, 0.1)");
      cursorGlow.addColorStop(0.55, "rgba(46, 107, 255, 0.05)");
      cursorGlow.addColorStop(1, "transparent");
      ctx.fillStyle = cursorGlow;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 22; i++) {
        const px =
          ((width * 0.17 * (i + 1) * 41) % width) +
          dx * (8 + (i % 4) * 4);
        const py =
          ((height * 0.13 * (i + 1) * 29) % height) +
          dy * (6 + (i % 3) * 3);
        ctx.beginPath();
        ctx.arc(px, py, (i % 3) * 0.4 + 0.7, 0, Math.PI * 2);
        ctx.fillStyle =
          i % 5 === 0 ? "rgba(241, 229, 0, 0.45)" : "rgba(30, 42, 90, 0.12)";
        ctx.fill();
      }

      const cx = width * (0.5 + dx * 0.07);
      const cy = height * (0.46 + dy * 0.05);
      const tilt = 0.62 + dy * 0.12;
      const spin = time * 0.4 + dx * 0.6;

      drawOrbit(
        ctx,
        cx,
        cy,
        width * 0.36,
        height * 0.14 * tilt,
        spin,
        "rgba(46, 107, 255, 0.22)"
      );
      drawOrbit(
        ctx,
        cx,
        cy,
        width * 0.27,
        height * 0.1 * tilt,
        -spin * 0.75 + 0.5,
        "rgba(213, 85, 89, 0.28)",
        true
      );
      drawOrbit(
        ctx,
        cx,
        cy,
        width * 0.44,
        height * 0.17 * tilt,
        spin * 0.35 + 1.2,
        "rgba(241, 229, 0, 0.3)"
      );

      const mainR = Math.min(width, height) * 0.13;
      drawOrb(ctx, cx, cy, mainR, ["#FFD56B", COLORS.coral], true);

      const satellites = [
        {
          angle: time * 1.05 + dx,
          dist: width * 0.3,
          ry: height * 0.12 * tilt,
          r: mainR * 0.2,
          colors: [COLORS.accent, COLORS.ocean] as [string, string],
        },
        {
          angle: -time * 0.8 + Math.PI + dy * 0.7,
          dist: width * 0.22,
          ry: height * 0.09 * tilt,
          r: mainR * 0.14,
          colors: ["#FFFFFF", COLORS.coral] as [string, string],
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

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("touchmove", onTouchMove);
    };
  }, [reduce]);

  return (
    <div
      ref={containerRef}
      className="about-facts-scene relative min-h-[220px] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/30 sm:min-h-[260px] lg:min-h-0 lg:h-full"
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
