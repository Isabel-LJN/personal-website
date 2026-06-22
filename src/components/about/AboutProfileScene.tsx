"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SoftBlobSimulation } from "@/lib/soft-blob-simulation";

interface AboutProfileSceneProps {
  className?: string;
  trackRef?: RefObject<HTMLElement | null>;
  pokeHint: string;
}

export function AboutProfileScene({
  className,
  trackRef,
  pokeHint,
}: AboutProfileSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    let cancelled = false;
    let teardown: (() => void) | undefined;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;

    const boot = async () => {
      const width = root.clientWidth;
      const height = root.clientHeight;
      if (width < 2 || height < 2) {
        retryTimer = setTimeout(boot, 50);
        return;
      }

      const THREE = await import("three");
      if (cancelled) return;

      const trackEl = trackRef?.current ?? root;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
      camera.position.set(0, 0.15, 4.2);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;

      const blobGroup = new THREE.Group();
      scene.add(blobGroup);

      const geometry = new THREE.IcosahedronGeometry(1, 4);
      const posAttr = geometry.attributes.position;
      const positions = posAttr.array as Float32Array;

      for (let i = 0; i < posAttr.count; i++) {
        positions[i * 3] *= 0.94;
        positions[i * 3 + 1] *= 1.1;
        positions[i * 3 + 2] *= 0.96;
      }
      posAttr.needsUpdate = true;
      geometry.computeVertexNormals();

      const sim = new SoftBlobSimulation(positions, posAttr.count);

      const blobMat = new THREE.MeshPhysicalMaterial({
        color: 0xd55559,
        roughness: 0.38,
        metalness: 0.04,
        clearcoat: 0.85,
        clearcoatRoughness: 0.22,
        sheen: 0.35,
        sheenRoughness: 0.6,
        sheenColor: new THREE.Color(0xf1e500),
      });

      const blob = new THREE.Mesh(geometry, blobMat);
      blobGroup.add(blob);

      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.35,
        metalness: 0,
      });
      const eyeWhiteMat = new THREE.MeshStandardMaterial({
        color: 0xfaf8f4,
        roughness: 0.4,
        metalness: 0,
      });

      const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), eyeMat);
      leftEye.position.set(-0.28, 0.18, 0.82);
      blobGroup.add(leftEye);

      const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), eyeMat);
      rightEye.position.set(0.28, 0.18, 0.82);
      blobGroup.add(rightEye);

      const leftShine = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 8, 8),
        eyeWhiteMat
      );
      leftShine.position.set(-0.25, 0.22, 0.9);
      blobGroup.add(leftShine);

      const rightShine = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 8, 8),
        eyeWhiteMat
      );
      rightShine.position.set(0.31, 0.22, 0.9);
      blobGroup.add(rightShine);

      const blushMat = new THREE.MeshStandardMaterial({
        color: 0xf1e500,
        roughness: 0.85,
        metalness: 0,
        transparent: true,
        opacity: 0.35,
      });
      const leftBlush = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 12, 12),
        blushMat
      );
      leftBlush.position.set(-0.52, -0.02, 0.72);
      leftBlush.scale.set(1.2, 0.7, 0.5);
      blobGroup.add(leftBlush);

      const rightBlush = leftBlush.clone();
      rightBlush.position.set(0.52, -0.02, 0.72);
      blobGroup.add(rightBlush);

      scene.add(new THREE.AmbientLight(0xfff5e8, 0.95));
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
      keyLight.position.set(2.5, 3, 4);
      scene.add(keyLight);
      const fillLight = new THREE.DirectionalLight(0xf1e500, 0.45);
      fillLight.position.set(-3, 0.5, 2);
      scene.add(fillLight);
      const rimLight = new THREE.DirectionalLight(0xffb4b6, 0.55);
      rimLight.position.set(0, -2, -3);
      scene.add(rimLight);

      const raycaster = new THREE.Raycaster();
      const pointerNdc = new THREE.Vector2();
      const pointerWorld = new THREE.Vector3();
      const trackNorm = { x: 0.5, y: 0.5 };
      let pointerDown = false;
      let hoverCanvas = false;
      let raf = 0;
      let time = 0;

      const setPointerFromClient = (clientX: number, clientY: number) => {
        const rect = canvas.getBoundingClientRect();
        pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      };

      const setTrackFromClient = (clientX: number, clientY: number) => {
        const rect = trackEl.getBoundingClientRect();
        trackNorm.x = Math.min(
          1,
          Math.max(0, (clientX - rect.left) / rect.width)
        );
        trackNorm.y = Math.min(
          1,
          Math.max(0, (clientY - rect.top) / rect.height)
        );
      };

      const pushAtPointer = (strength: number, radius: number) => {
        raycaster.setFromCamera(pointerNdc, camera);
        const hits = raycaster.intersectObject(blob, false);
        if (hits.length > 0) {
          pointerWorld.copy(hits[0].point);
          blob.worldToLocal(pointerWorld);
          sim.applyPointer(
            pointerWorld.x,
            pointerWorld.y,
            pointerWorld.z,
            radius,
            strength
          );
        }
      };

      const onPointerMove = (e: PointerEvent) => {
        setTrackFromClient(e.clientX, e.clientY);
        if (!hoverCanvas && e.target !== canvas) return;
        setPointerFromClient(e.clientX, e.clientY);
        pushAtPointer(pointerDown ? 0.55 : 0.22, pointerDown ? 0.55 : 0.48);
      };

      const onCanvasEnter = () => {
        hoverCanvas = true;
      };
      const onCanvasLeave = () => {
        hoverCanvas = false;
        pointerDown = false;
      };
      const onCanvasDown = (e: PointerEvent) => {
        pointerDown = true;
        setPointerFromClient(e.clientX, e.clientY);
        pushAtPointer(0.75, 0.5);
      };
      const onCanvasUp = () => {
        pointerDown = false;
      };

      const onTrackMove = (e: MouseEvent) => {
        setTrackFromClient(e.clientX, e.clientY);
      };

      const loop = (now: number) => {
        time = now * 0.001;
        const breathe = reduce ? 0 : Math.sin(time * 1.6) * 0.015;

        if (!reduce) {
          const tiltX = (trackNorm.x - 0.5) * 2;
          const tiltY = (trackNorm.y - 0.5) * 2;
          sim.applyDirectionalTilt(tiltX, -tiltY, hoverCanvas ? 0.35 : 0.85);

          blobGroup.rotation.y = THREE.MathUtils.lerp(
            blobGroup.rotation.y,
            tiltX * 0.22,
            0.06
          );
          blobGroup.rotation.x = THREE.MathUtils.lerp(
            blobGroup.rotation.x,
            tiltY * 0.14,
            0.06
          );
        }

        sim.step(reduce ? 0.16 : 0.1, reduce ? 0.78 : 0.84, 0.45, breathe);
        posAttr.needsUpdate = true;
        geometry.computeVertexNormals();

        if (!reduce) {
          blobGroup.position.y = Math.sin(time * 1.4) * 0.04;
        }

        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };

      raf = requestAnimationFrame(loop);

      const resize = () => {
        const w = root.clientWidth;
        const h = root.clientHeight;
        if (w < 2 || h < 2) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };

      const ro = new ResizeObserver(resize);
      ro.observe(root);

      canvas.addEventListener("pointerenter", onCanvasEnter);
      canvas.addEventListener("pointerleave", onCanvasLeave);
      canvas.addEventListener("pointerdown", onCanvasDown);
      canvas.addEventListener("pointerup", onCanvasUp);
      canvas.addEventListener("pointercancel", onCanvasUp);
      canvas.addEventListener("pointermove", onPointerMove);
      trackEl.addEventListener("mousemove", onTrackMove);

      teardown = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        canvas.removeEventListener("pointerenter", onCanvasEnter);
        canvas.removeEventListener("pointerleave", onCanvasLeave);
        canvas.removeEventListener("pointerdown", onCanvasDown);
        canvas.removeEventListener("pointerup", onCanvasUp);
        canvas.removeEventListener("pointercancel", onCanvasUp);
        canvas.removeEventListener("pointermove", onPointerMove);
        trackEl.removeEventListener("mousemove", onTrackMove);
        geometry.dispose();
        blobMat.dispose();
        eyeMat.dispose();
        eyeWhiteMat.dispose();
        blushMat.dispose();
        leftEye.geometry.dispose();
        rightEye.geometry.dispose();
        leftShine.geometry.dispose();
        rightShine.geometry.dispose();
        leftBlush.geometry.dispose();
        renderer.dispose();
      };
    };

    boot();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      teardown?.();
    };
  }, [reduce, trackRef]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "about-profile-scene relative min-h-[280px] cursor-grab overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/30 active:cursor-grabbing",
        className
      )}
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full touch-none" />
      <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[10px] font-medium tracking-wide text-[var(--color-text-dim)]/80">
        {pokeHint}
      </p>
    </div>
  );
}
