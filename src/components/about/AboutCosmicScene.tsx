"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

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

function drawPlanet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  stops: [string, string, string],
  highlightAngle: number
) {
  const grad = ctx.createRadialGradient(
    x - radius * 0.35,
    y - radius * 0.35,
    radius * 0.15,
    x,
    y,
    radius
  );
  grad.addColorStop(0, stops[0]);
  grad.addColorStop(0.55, stops[1]);
  grad.addColorStop(1, stops[2]);

  ctx.save();
  ctx.shadowColor = "rgba(30, 42, 90, 0.25)";
  ctx.shadowBlur = radius * 0.45;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.ellipse(
    x + Math.cos(highlightAngle) * radius * 0.15,
    y + Math.sin(highlightAngle) * radius * 0.15,
    radius * 0.55,
    radius * 0.22,
    highlightAngle,
    0,
    Math.PI * 2
  );
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();
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
  ctx.lineWidth = 1.5;
  if (dashed) ctx.setLineDash([6, 10]);
  ctx.stroke();
  ctx.restore();
}

function drawWaveLayer(
  ctx: CanvasRenderingContext2D,
  width: number,
  baseY: number,
  amplitude: number,
  wavelength: number,
  phase: number,
  fill: string,
  mouseShift: number
) {
  ctx.beginPath();
  ctx.moveTo(0, baseY);

  const steps = Math.ceil(width / 4);
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * width;
    const y =
      baseY +
      Math.sin((x / wavelength) * Math.PI * 2 + phase + mouseShift) * amplitude +
      Math.sin((x / (wavelength * 0.6)) * Math.PI * 2 + phase * 1.3) *
        (amplitude * 0.35);
    ctx.lineTo(x, y);
  }

  ctx.lineTo(width, ctx.canvas.height);
  ctx.lineTo(0, ctx.canvas.height);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
}

function drawStars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  seed: number,
  parallaxX: number,
  parallaxY: number
) {
  for (let i = 0; i < 48; i++) {
    const px = ((seed * (i + 1) * 97) % width) + parallaxX * (0.4 + (i % 5) * 0.12);
    const py = ((seed * (i + 1) * 53) % (height * 0.65)) + parallaxY * (0.3 + (i % 4) * 0.1);
    const r = (i % 3) + 0.6;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = i % 4 === 0 ? COLORS.accent : "rgba(30, 42, 90, 0.18)";
    ctx.globalAlpha = 0.35 + (i % 5) * 0.1;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export function AboutCosmicScene() {
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
      time += reduce ? 0.004 : 0.012;
      smoothRef.current.x = lerp(
        smoothRef.current.x,
        pointerRef.current.x,
        reduce ? 1 : 0.07
      );
      smoothRef.current.y = lerp(
        smoothRef.current.y,
        pointerRef.current.y,
        reduce ? 1 : 0.07
      );

      const mx = smoothRef.current.x;
      const my = smoothRef.current.y;
      const dx = (mx - 0.5) * 2;
      const dy = (my - 0.5) * 2;

      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "rgba(250, 248, 244, 0.92)");
      bg.addColorStop(0.45, "rgba(232, 228, 220, 0.55)");
      bg.addColorStop(1, "rgba(213, 85, 89, 0.08)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      drawStars(ctx, width, height, width * 0.37, dx * 18, dy * 12);

      const cx = width * (0.52 + dx * 0.08);
      const cy = height * (0.38 + dy * 0.06);
      const orbitTilt = 0.55 + dy * 0.18;
      const orbitSpin = time * 0.35 + dx * 0.8;

      drawOrbitRing(
        ctx,
        cx,
        cy,
        width * 0.34,
        height * 0.11 * orbitTilt,
        orbitSpin,
        "rgba(46, 107, 255, 0.35)"
      );
      drawOrbitRing(
        ctx,
        cx,
        cy,
        width * 0.26,
        height * 0.085 * orbitTilt,
        -orbitSpin * 0.7 + 0.4,
        "rgba(213, 85, 89, 0.4)",
        true
      );
      drawOrbitRing(
        ctx,
        cx,
        cy,
        width * 0.42,
        height * 0.13 * orbitTilt,
        orbitSpin * 0.45 + 1.1,
        "rgba(241, 229, 0, 0.45)"
      );

      const mainR = Math.min(width, height) * 0.14;
      drawPlanet(ctx, cx, cy, mainR, ["#FFD56B", COLORS.coral, "#8E2E45"], time);

      const satellites = [
        {
          angle: time * 1.1 + dx * 1.2,
          dist: width * 0.28,
          ry: height * 0.1 * orbitTilt,
          r: mainR * 0.22,
          colors: [COLORS.accent, COLORS.ocean, COLORS.deep] as [
            string,
            string,
            string,
          ],
        },
        {
          angle: -time * 0.85 + Math.PI + dy * 0.9,
          dist: width * 0.2,
          ry: height * 0.08 * orbitTilt,
          r: mainR * 0.16,
          colors: [COLORS.violet, "#4A3AFF", COLORS.deep] as [
            string,
            string,
            string,
          ],
        },
        {
          angle: time * 0.65 + 2.1 + dx * 0.5,
          dist: width * 0.36,
          ry: height * 0.12 * orbitTilt,
          r: mainR * 0.12,
          colors: ["#FFFFFF", COLORS.coral, "#A04050"] as [string, string, string],
        },
      ];

      for (const sat of satellites) {
        const sx = cx + Math.cos(sat.angle) * sat.dist;
        const sy = cy + Math.sin(sat.angle) * sat.ry;
        drawPlanet(ctx, sx, sy, sat.r, sat.colors, sat.angle);
      }

      const waveBase = height * 0.72;
      const mousePhase = dx * 1.4 + dy * 0.6;

      drawWaveLayer(
        ctx,
        width,
        waveBase + height * 0.06,
        height * 0.045,
        width * 0.55,
        time * 1.6,
        "rgba(46, 107, 255, 0.22)",
        mousePhase
      );
      drawWaveLayer(
        ctx,
        width,
        waveBase + height * 0.02,
        height * 0.055,
        width * 0.42,
        time * 2.1 + 1,
        "rgba(213, 85, 89, 0.28)",
        mousePhase * 1.2
      );
      drawWaveLayer(
        ctx,
        width,
        waveBase,
        height * 0.06,
        width * 0.38,
        time * 1.3 + 2.4,
        "rgba(241, 229, 0, 0.38)",
        mousePhase * 0.85
      );
      drawWaveLayer(
        ctx,
        width,
        waveBase - height * 0.04,
        height * 0.035,
        width * 0.48,
        time * 2.8 + 0.5,
        "rgba(123, 92, 255, 0.18)",
        mousePhase * 1.5
      );

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
      className="about-cosmic-scene relative h-full min-h-[220px] w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/30 sm:min-h-[260px] lg:min-h-[320px]"
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
