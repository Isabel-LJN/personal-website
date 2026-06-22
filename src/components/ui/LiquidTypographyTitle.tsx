"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type * as THREE from "three";
import { cn } from "@/lib/utils";
import { DisplacementField } from "@/lib/displacement-field";
import { rasterizeTextElement } from "@/lib/rasterize-text";
import {
  liquidFragmentShader,
  liquidVertexShader,
} from "./liquid-title-shaders";

const FIELD_SIZE = 72;
const INFLUENCE_RADIUS = 0.24;
const POINTER_STRENGTH = 0.022;
const DISTORTION_SCALE = 0.095;
const AMBIENT_STRENGTH = 0.0055;
const ACTIVITY_THRESHOLD = 0.0008;

interface PointerState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

interface LiquidRuntime {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  material: THREE.ShaderMaterial;
  mesh: THREE.Mesh;
  textTexture: THREE.Texture;
  displacementTexture: THREE.DataTexture;
  field: DisplacementField;
}

interface LiquidTypographyTitleProps {
  title: string;
  className?: string;
  titleClassName?: string;
}

export function LiquidTypographyTitle({
  title,
  className,
  titleClassName,
}: LiquidTypographyTitleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);

  const runtimeRef = useRef<LiquidRuntime | null>(null);
  const pointerRef = useRef<PointerState>({
    x: -1,
    y: -1,
    vx: 0,
    vy: 0,
    active: false,
  });
  const prevPointerRef = useRef({ x: -1, y: -1 });
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const textBoundsRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  useEffect(() => {
    if (reduce) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;

    import("three").then((THREE) => {
      if (cancelled) return;

      const canvas = canvasRef.current;
      const container = containerRef.current;
      const measureEl = measureRef.current;
      if (!canvas || !container || !measureEl) return;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const field = new DisplacementField(FIELD_SIZE);

      const useFloatTexture = renderer.capabilities.isWebGL2;
      const displacementTexture = new THREE.DataTexture(
        field.textureData,
        FIELD_SIZE,
        FIELD_SIZE,
        THREE.RGBAFormat,
        useFloatTexture ? THREE.FloatType : THREE.HalfFloatType
      );
      displacementTexture.minFilter = THREE.LinearFilter;
      displacementTexture.magFilter = THREE.LinearFilter;

      const textTexture = new THREE.Texture();
      textTexture.minFilter = THREE.LinearFilter;
      textTexture.magFilter = THREE.LinearFilter;
      textTexture.colorSpace = THREE.SRGBColorSpace;

      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTextMap: { value: textTexture },
          uDisplacementMap: { value: displacementTexture },
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(1, 1) },
          uDistortionScale: { value: DISTORTION_SCALE },
          uAmbientStrength: { value: AMBIENT_STRENGTH },
        },
        vertexShader: liquidVertexShader,
        fragmentShader: liquidFragmentShader,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });

      const geometry = new THREE.PlaneGeometry(1, 1);
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      let camera = new THREE.OrthographicCamera(0, 1, 0, 1, -10, 10);
      camera.position.z = 5;

      runtimeRef.current = {
        renderer,
        scene,
        camera,
        material,
        mesh,
        textTexture,
        displacementTexture,
        field,
      };

      let containerW = 0;
      let containerH = 0;

      const syncTextLayout = () => {
        const containerRect = container.getBoundingClientRect();
        const titleRect = measureEl.getBoundingClientRect();

        textBoundsRef.current = {
          x: titleRect.left - containerRect.left,
          y: titleRect.top - containerRect.top,
          w: titleRect.width,
          h: titleRect.height,
        };

        const { x, y, w, h } = textBoundsRef.current;
        mesh.position.set(x + w / 2, y + h / 2, 0);
        mesh.scale.set(w, h, 1);
      };

      const rebuildTextTexture = async () => {
        const { canvas: textCanvas, width, height } =
          await rasterizeTextElement(measureEl, 2);

        if (cancelled) return;

        textTexture.image = textCanvas;
        textTexture.needsUpdate = true;
        material.uniforms.uResolution.value.set(width, height);
        syncTextLayout();
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        containerW = container.clientWidth;
        containerH = container.clientHeight;

        renderer.setPixelRatio(dpr);
        renderer.setSize(containerW, containerH, false);

        camera = new THREE.OrthographicCamera(
          0,
          containerW,
          containerH,
          0,
          -10,
          10
        );
        camera.position.z = 5;
        runtimeRef.current!.camera = camera;

        syncTextLayout();
        rebuildTextTexture();
      };

      const updatePointer = (clientX: number, clientY: number) => {
        const bounds = textBoundsRef.current;
        const x = clientX - container.getBoundingClientRect().left - bounds.x;
        const y = clientY - container.getBoundingClientRect().top - bounds.y;

        const prev = prevPointerRef.current;
        const nx = bounds.w > 0 ? x / bounds.w : -1;
        const ny = bounds.h > 0 ? y / bounds.h : -1;

        pointerRef.current = {
          x: nx,
          y: ny,
          vx: nx - prev.x,
          vy: ny - prev.y,
          active: nx >= -0.05 && nx <= 1.05 && ny >= -0.05 && ny <= 1.05,
        };
        prevPointerRef.current = { x: nx, y: ny };
      };

      const draw = (timestamp: number) => {
        const runtime = runtimeRef.current;
        if (!runtime) return;

        const pointer = pointerRef.current;
        const { field, material, displacementTexture, renderer, scene, camera } =
          runtime;

        if (pointer.active) {
          field.applyPointer(
            pointer.x,
            pointer.y,
            pointer.vx,
            pointer.vy,
            INFLUENCE_RADIUS,
            POINTER_STRENGTH + Math.hypot(pointer.vx, pointer.vy) * 0.06
          );
        }

        const activity = field.getActivity();
        const spring = pointer.active || activity > ACTIVITY_THRESHOLD ? 0.045 : 0.05;
        const damping = pointer.active || activity > ACTIVITY_THRESHOLD ? 0.86 : 0.9;
        field.step(spring, damping, 0.2);
        displacementTexture.needsUpdate = true;
        material.uniforms.uTime.value = timestamp * 0.001;

        renderer.render(scene, camera);
        rafRef.current = requestAnimationFrame(draw);
      };

      const startLoop = () => {
        if (!runningRef.current) {
          runningRef.current = true;
          cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(draw);
        }
      };

      const onPointerMove = (e: PointerEvent) => {
        updatePointer(e.clientX, e.clientY);
        startLoop();
      };

      const onPointerEnter = (e: PointerEvent) => {
        const bounds = textBoundsRef.current;
        const x =
          e.clientX -
          container.getBoundingClientRect().left -
          bounds.x;
        const y =
          e.clientY -
          container.getBoundingClientRect().top -
          bounds.y;
        prevPointerRef.current = {
          x: bounds.w > 0 ? x / bounds.w : -1,
          y: bounds.h > 0 ? y / bounds.h : -1,
        };
        updatePointer(e.clientX, e.clientY);
        startLoop();
      };

      const onPointerLeave = () => {
        pointerRef.current.active = false;
        prevPointerRef.current = { x: -1, y: -1 };
        startLoop();
      };

      resize();
      const ro = new ResizeObserver(() => resize());
      ro.observe(container);
      ro.observe(measureEl);

      const onFontsReady = () => {
        resize();
        rebuildTextTexture().then(() => setReady(true));
      };

      if (document.fonts?.status === "loaded") {
        onFontsReady();
      } else if (document.fonts?.ready) {
        document.fonts.ready.then(onFontsReady);
      } else {
        onFontsReady();
      }

      container.addEventListener("pointerenter", onPointerEnter);
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerleave", onPointerLeave);

      startLoop();

      teardown = () => {
        cancelAnimationFrame(rafRef.current);
        ro.disconnect();
        container.removeEventListener("pointerenter", onPointerEnter);
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerleave", onPointerLeave);
        geometry.dispose();
        material.dispose();
        textTexture.dispose();
        displacementTexture.dispose();
        renderer.dispose();
        runtimeRef.current = null;
      };
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [reduce, title]);

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
      className={cn(
        "liquid-typography-title relative inline-block max-w-full cursor-default select-none",
        className
      )}
    >
      <h1 className="sr-only">{title}</h1>
      <canvas
        ref={canvasRef}
        className="liquid-typography-canvas absolute inset-0 z-10"
        aria-hidden
      />
      <h1
        ref={measureRef}
        className={cn(
          "aw-title pointer-events-none relative z-0 max-w-[16ch] text-balance opacity-0",
          titleClassName
        )}
        aria-hidden
      >
        {title}
      </h1>
      {!ready && (
        <h1
          className={cn(
            "aw-title relative z-0 max-w-[16ch] text-balance",
            titleClassName
          )}
        >
          {title}
        </h1>
      )}
    </div>
  );
}
