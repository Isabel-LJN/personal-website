"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type * as THREE from "three";
import { cn } from "@/lib/utils";
import { sampleTextPixels } from "@/lib/sample-text-pixels";

const INFLUENCE_RADIUS = 120;
const MAX_DISPLACE = 50;
const SPRING = 0.055;
const DAMPING = 0.78;
const PUSH_BASE = 3.2;
const MASK_RADIUS = 100;

interface Particle {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

interface PointerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

interface ThreeRuntime {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  geometry: THREE.BufferGeometry;
  material: THREE.PointsMaterial;
  positions: Float32Array;
}

interface ParticleTypographyTitleProps {
  title: string;
  className?: string;
  titleClassName?: string;
  hiddenWords?: string[];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function ParticleTypographyTitle({
  title,
  className,
  titleClassName,
  hiddenWords = [],
}: ParticleTypographyTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);

  const particlesRef = useRef<Particle[]>([]);
  const pointerRef = useRef<PointerState>({
    x: -9999,
    y: -9999,
    vx: 0,
    vy: 0,
    active: false,
  });
  const prevPointerRef = useRef({ x: -9999, y: -9999 });
  const maskRadiusRef = useRef(0);
  const targetMaskRef = useRef(0);
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const textOriginRef = useRef({ x: 0, y: 0 });
  const textBoundsRef = useRef({ w: 0, h: 0 });
  const threeRef = useRef<ThreeRuntime | null>(null);

  useEffect(() => {
    if (reduce) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    import("three").then((THREE) => {
      if (cancelled) return;

      const canvas = canvasRef.current;
      const container = containerRef.current;
      const titleEl = titleRef.current;
      if (!canvas || !container || !titleEl) return;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const geometry = new THREE.BufferGeometry();
      const material = new THREE.PointsMaterial({
        color: 0x0a0a0a,
        size: 2.2,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.82,
        depthTest: false,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      let camera = new THREE.OrthographicCamera(0, 1, 0, 1, -500, 500);
      camera.position.z = 10;

      threeRef.current = {
        renderer,
        scene,
        camera,
        geometry,
        material,
        positions: new Float32Array(0),
      };

      let width = 0;
      let height = 0;
      let hiddenWordIndex = 0;
      let hiddenWordTimer = 0;

      const rebuildParticles = async () => {
        const sample = await sampleTextPixels(titleEl, width > 600 ? 3 : 4);
        textBoundsRef.current = { w: sample.width, h: sample.height };

        const containerRect = container.getBoundingClientRect();
        const titleRect = titleEl.getBoundingClientRect();
        textOriginRef.current = {
          x: titleRect.left - containerRect.left,
          y: titleRect.top - containerRect.top,
        };

        const particles: Particle[] = sample.pixels.map((p) => ({
          ox: p.x,
          oy: p.y,
          x: p.x,
          y: p.y,
          vx: 0,
          vy: 0,
          size: 1 + Math.random() * 1.2,
          alpha: 0.55 + Math.random() * 0.35,
        }));

        particlesRef.current = particles;

        const positions = new Float32Array(particles.length * 3);
        geometry.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3)
        );
        threeRef.current!.positions = positions;
        geometry.attributes.position.needsUpdate = true;
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = container.clientWidth;
        height = container.clientHeight;

        renderer.setPixelRatio(dpr);
        renderer.setSize(width, height, false);

        camera = new THREE.OrthographicCamera(0, width, height, 0, -500, 500);
        camera.position.z = 10;
        threeRef.current!.camera = camera;

        rebuildParticles();
      };

      const updatePointer = (clientX: number, clientY: number) => {
        const rect = titleEl.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const prev = prevPointerRef.current;
        pointerRef.current = {
          x,
          y,
          vx: x - prev.x,
          vy: y - prev.y,
          active: true,
        };
        prevPointerRef.current = { x, y };
        targetMaskRef.current = MASK_RADIUS;
        titleEl.style.setProperty("--mx", `${x}px`);
        titleEl.style.setProperty("--my", `${y}px`);
      };

      const updateHiddenWords = (dispersion: number) => {
        const el = hiddenRef.current;
        if (!el || hiddenWords.length === 0) return;

        const alpha = Math.min(0.32, dispersion * 0.02);
        el.style.opacity = alpha < 0.05 ? "0" : String(alpha);

        if (alpha < 0.05) return;

        hiddenWordTimer += 0.016;
        if (hiddenWordTimer > 2.6) {
          hiddenWordTimer = 0;
          hiddenWordIndex = (hiddenWordIndex + 1) % hiddenWords.length;
          el.textContent = hiddenWords[hiddenWordIndex];
        }
      };

      const simulate = () => {
        const particles = particlesRef.current;
        const pointer = pointerRef.current;
        let totalDispersion = 0;

        for (const p of particles) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = Math.hypot(dx, dy);

          if (pointer.active && dist < INFLUENCE_RADIUS) {
            const t = 1 - dist / INFLUENCE_RADIUS;
            const force = t * t * PUSH_BASE;
            const angle = dist > 0.5 ? Math.atan2(dy, dx) : 0;
            p.vx += Math.cos(angle) * force + pointer.vx * 0.18;
            p.vy += Math.sin(angle) * force + pointer.vy * 0.18;
          }

          p.vx += (p.ox - p.x) * SPRING;
          p.vy += (p.oy - p.y) * SPRING;
          p.vx *= DAMPING;
          p.vy *= DAMPING;
          p.x += p.vx;
          p.y += p.vy;

          const odx = p.x - p.ox;
          const ody = p.y - p.oy;
          const od = Math.hypot(odx, ody);
          if (od > MAX_DISPLACE) {
            const scale = MAX_DISPLACE / od;
            p.x = p.ox + odx * scale;
            p.y = p.oy + ody * scale;
            p.vx *= 0.45;
            p.vy *= 0.45;
          }

          totalDispersion += od;
        }

        return particles.length > 0 ? totalDispersion / particles.length : 0;
      };

      const syncGeometry = (origin: { x: number; y: number }) => {
        const particles = particlesRef.current;
        const positions = threeRef.current!.positions;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          positions[i * 3] = origin.x + p.x;
          positions[i * 3 + 1] = origin.y + p.y;
          positions[i * 3 + 2] = 0;
        }

        geometry.attributes.position.needsUpdate = true;
      };

      const draw = () => {
        const particles = particlesRef.current;
        const origin = textOriginRef.current;
        const dispersion = simulate();

        maskRadiusRef.current = lerp(
          maskRadiusRef.current,
          targetMaskRef.current,
          0.12
        );
        titleEl.style.setProperty("--mask-r", `${maskRadiusRef.current}px`);
        updateHiddenWords(dispersion);

        const maskOpen = maskRadiusRef.current > 2;
        const pointer = pointerRef.current;

        const shouldRender =
          pointer.active ||
          maskOpen ||
          particles.some(
            (p) =>
              Math.hypot(p.x - p.ox, p.y - p.oy) > 0.35 ||
              Math.hypot(p.vx, p.vy) > 0.06
          );

        if (shouldRender) {
          syncGeometry(origin);
          renderer.render(scene, camera);
        } else {
          renderer.clear();
          titleEl.style.setProperty("--mask-r", "0px");
          if (hiddenRef.current) hiddenRef.current.style.opacity = "0";
        }

        if (shouldRender) {
          rafRef.current = requestAnimationFrame(draw);
          runningRef.current = true;
        } else {
          runningRef.current = false;
        }
      };

      const startLoop = () => {
        if (!runningRef.current) {
          runningRef.current = true;
          rafRef.current = requestAnimationFrame(draw);
        }
      };

      const onPointerMove = (e: PointerEvent) => {
        updatePointer(e.clientX, e.clientY);
        startLoop();
      };

      const onPointerEnter = (e: PointerEvent) => {
        prevPointerRef.current = {
          x: e.clientX - titleEl.getBoundingClientRect().left,
          y: e.clientY - titleEl.getBoundingClientRect().top,
        };
        updatePointer(e.clientX, e.clientY);
        startLoop();
      };

      const onPointerLeave = () => {
        pointerRef.current.active = false;
        targetMaskRef.current = 0;
        prevPointerRef.current = { x: -9999, y: -9999 };
        startLoop();
      };

      resize();
      const ro = new ResizeObserver(() => resize());
      ro.observe(container);

      document.fonts?.ready.then(() => resize());

      if (hiddenRef.current && hiddenWords.length > 0) {
        hiddenRef.current.textContent = hiddenWords[0];
      }

      titleEl.addEventListener("pointerenter", onPointerEnter);
      titleEl.addEventListener("pointermove", onPointerMove);
      titleEl.addEventListener("pointerleave", onPointerLeave);

      setReady(true);

      teardown = () => {
        cancelAnimationFrame(rafRef.current);
        ro.disconnect();
        titleEl.removeEventListener("pointerenter", onPointerEnter);
        titleEl.removeEventListener("pointermove", onPointerMove);
        titleEl.removeEventListener("pointerleave", onPointerLeave);
        titleEl.style.removeProperty("--mask-r");
        titleEl.style.removeProperty("--mx");
        titleEl.style.removeProperty("--my");
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        threeRef.current = null;
      };
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [reduce, hiddenWords, title]);

  if (reduce) {
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
    <div
      ref={containerRef}
      className={cn("relative inline-block max-w-full", className)}
    >
      {hiddenWords.length > 0 && (
        <div
          ref={hiddenRef}
          className="particle-typography-hidden pointer-events-none absolute inset-0 z-0 flex items-center justify-center text-[clamp(0.75rem,2.2vw,1.1rem)] font-medium tracking-wide text-[var(--color-text-secondary)] opacity-0"
          aria-hidden
        />
      )}
      <canvas
        ref={canvasRef}
        className="particle-typography-canvas pointer-events-none absolute inset-0 z-20"
        aria-hidden
      />
      <h1
        ref={titleRef}
        className={cn(
          "particle-typography-title aw-title relative z-10 max-w-[16ch] cursor-default text-balance select-none",
          titleClassName
        )}
      >
        {title}
      </h1>
      {!ready && (
        <span className="sr-only" aria-live="polite">交互标题加载中</span>
      )}
    </div>
  );
}
