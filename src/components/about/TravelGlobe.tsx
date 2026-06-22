"use client";

import { useEffect, useRef, useCallback } from "react";
import type * as THREE from "three";
import type { TravelCity } from "@/i18n/types";
import { latLngToVector3, greatCircleArcPoints, globeRotationForCity } from "@/lib/geo";

interface TravelGlobeProps {
  cities: TravelCity[];
  focusCityId?: string | null;
  autoRotate: boolean;
  reducedMotion?: boolean;
  onCityHover?: (city: TravelCity | null) => void;
  onCityClick?: (city: TravelCity) => void;
}

const GLOBE_RADIUS = 1;
const MARKER_VISITED = 0.028;
const MARKER_WISHLIST = 0.014;
const AUTO_ROTATE_SPEED = 0.15;

function lerpAngle(from: number, to: number, t: number) {
  let delta = to - from;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return from + delta * t;
}

export function TravelGlobe({
  cities,
  focusCityId,
  autoRotate,
  reducedMotion = false,
  onCityHover,
  onCityClick,
}: TravelGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markerMapRef = useRef<Map<string, TravelCity>>(new Map());
  const callbacksRef = useRef({ onCityHover, onCityClick });
  callbacksRef.current = { onCityHover, onCityClick };

  const threeRef = useRef<typeof import("three") | null>(null);
  const focusCityImplRef = useRef<(cityId: string) => void>(() => {});

  const initialCityId =
    focusCityId ?? cities.find((c) => c.visited)?.id ?? cities[0]?.id;
  const initialCity = cities.find((c) => c.id === initialCityId);
  const initialRot = initialCity
    ? globeRotationForCity(initialCity.lat, initialCity.lng)
    : { rotX: 0, rotY: 0 };

  const stateRef = useRef({
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    lastX: 0,
    lastY: 0,
    rotX: initialRot.rotX,
    rotY: initialRot.rotY,
    targetRotX: initialRot.rotX,
    targetRotY: initialRot.rotY,
    zoom: 2.8,
    targetZoom: 2.8,
    hoveredId: null as string | null,
  });

  const focusCity = useCallback((cityId: string) => {
    focusCityImplRef.current(cityId);
  }, []);

  useEffect(() => {
    if (focusCityId) focusCity(focusCityId);
  }, [focusCityId, focusCity]);

  useEffect(() => {
    let cancelled = false;
    let teardown: (() => void) | undefined;

    const boot = async () => {
      const container = containerRef.current;
      if (!container || cancelled) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width < 2 || height < 2) return;

      const THREE = await import("three");
      if (cancelled) return;

      threeRef.current = THREE;

      const rotationForCity = (lat: number, lng: number) => {
        const pos = latLngToVector3(lat, lng, 1);
        const local = new THREE.Vector3(pos.x, pos.y, pos.z).normalize();
        const q = new THREE.Quaternion().setFromUnitVectors(
          local,
          new THREE.Vector3(0, 0, 1)
        );
        const euler = new THREE.Euler().setFromQuaternion(q, "XYZ");
        return { rotX: euler.x, rotY: euler.y, rotZ: euler.z };
      };

      focusCityImplRef.current = (cityId: string) => {
        const city = cities.find((c) => c.id === cityId);
        if (!city) return;
        const { rotX, rotY } = rotationForCity(city.lat, city.lng);
        const s = stateRef.current;
        s.targetRotX = rotX;
        s.targetRotY = rotY;
        s.targetZoom = 2.2;
      };

      if (initialCity) {
        const { rotX, rotY } = rotationForCity(
          initialCity.lat,
          initialCity.lng
        );
        const s = stateRef.current;
        s.rotX = rotX;
        s.rotY = rotY;
        s.targetRotX = rotX;
        s.targetRotY = rotY;
      }

      if (focusCityId) {
        focusCityImplRef.current(focusCityId);
      }

      const loadTexture = (url: string) =>
        new Promise<InstanceType<typeof THREE.Texture>>((resolve, reject) => {
          new THREE.TextureLoader().setCrossOrigin("anonymous").load(
            url,
            resolve,
            undefined,
            reject
          );
        });

      const createFallbackEarthTexture = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext("2d")!;

        const ocean = ctx.createLinearGradient(0, 0, 0, canvas.height);
        ocean.addColorStop(0, "#5b8fa8");
        ocean.addColorStop(0.5, "#4a7d96");
        ocean.addColorStop(1, "#3d6d85");
        ctx.fillStyle = ocean;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#8faa72";
        const land = [
          [120, 80, 220, 120],
          [380, 60, 280, 140],
          [680, 90, 260, 130],
          [180, 200, 200, 100],
          [520, 180, 240, 120],
          [760, 220, 180, 90],
          [300, 320, 180, 80],
          [600, 300, 200, 100],
        ];
        for (const [x, y, w, h] of land) {
          ctx.beginPath();
          ctx.ellipse(x, y, w / 2, h / 2, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        return tex;
      };

      let colorMap: InstanceType<typeof THREE.Texture>;

      try {
        colorMap = await loadTexture("/textures/earth.jpg");
        colorMap.colorSpace = THREE.SRGBColorSpace;
      } catch {
        try {
          colorMap = await loadTexture(
            "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg"
          );
          colorMap.colorSpace = THREE.SRGBColorSpace;
        } catch {
          colorMap = createFallbackEarthTexture();
        }
      }

      if (cancelled) {
        colorMap.dispose();
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0, stateRef.current.zoom);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const globeGroup = new THREE.Group();
      globeGroup.rotation.order = "XYZ";
      scene.add(globeGroup);

      const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
      const globeMat = new THREE.MeshPhongMaterial({
        map: colorMap,
        color: 0xffffff,
        specular: new THREE.Color(0x335566),
        shininess: 20,
      });
      const globe = new THREE.Mesh(globeGeo, globeMat);
      globeGroup.add(globe);

      const wireGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.003, 36, 18);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.05,
      });
      globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

      const atmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.08, 48, 48);
      const atmoMat = new THREE.MeshBasicMaterial({
        color: 0x6eb5d8,
        transparent: true,
        opacity: 0.14,
        side: THREE.BackSide,
      });
      globeGroup.add(new THREE.Mesh(atmoGeo, atmoMat));

      scene.add(new THREE.AmbientLight(0xffffff, 0.9));
      const keyLight = new THREE.DirectionalLight(0xfff8f0, 1.3);
      keyLight.position.set(5, 3, 6);
      scene.add(keyLight);
      const fillLight = new THREE.DirectionalLight(0xa8cce8, 0.5);
      fillLight.position.set(-4, -1, 3);
      scene.add(fillLight);
      const rimLight = new THREE.DirectionalLight(0xf1e500, 0.15);
      rimLight.position.set(-3, 2, -5);
      scene.add(rimLight);

      const markerMeshes: {
        mesh: THREE.Mesh;
        glow: THREE.Mesh | null;
        city: TravelCity;
      }[] = [];
      const arcLines: THREE.Line[] = [];
      markerMapRef.current.clear();

      const visitedOrdered = cities.filter((city) => city.visited);
      for (let i = 0; i < visitedOrdered.length - 1; i++) {
        const from = visitedOrdered[i];
        const to = visitedOrdered[i + 1];
        const arcPoints = greatCircleArcPoints(
          from.lat,
          from.lng,
          to.lat,
          to.lng,
          GLOBE_RADIUS * 1.012,
          40
        );
        const arcGeo = new THREE.BufferGeometry().setFromPoints(
          arcPoints.map((p) => new THREE.Vector3(p.x, p.y, p.z))
        );
        const arcMat = new THREE.LineBasicMaterial({
          color: 0xf1e500,
          transparent: true,
          opacity: 0.42,
        });
        const arc = new THREE.Line(arcGeo, arcMat);
        globeGroup.add(arc);
        arcLines.push(arc);
      }

      for (const city of cities) {
        const pos = latLngToVector3(city.lat, city.lng, GLOBE_RADIUS * 1.01);
        const isVisited = city.visited;
        const size = isVisited ? MARKER_VISITED : MARKER_WISHLIST;
        const color = isVisited
          ? city.accent ?? "#d55559"
          : "#8a8578";

        const markerGeo = new THREE.SphereGeometry(size, 12, 12);
        const markerMat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: isVisited ? 1 : 0.55,
        });
        const marker = new THREE.Mesh(markerGeo, markerMat);
        marker.position.set(pos.x, pos.y, pos.z);
        marker.userData = { cityId: city.id };
        globeGroup.add(marker);

        let glow: THREE.Mesh | null = null;
        if (isVisited) {
          const glowGeo = new THREE.SphereGeometry(size * 2.2, 12, 12);
          const glowMat = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.22,
          });
          glow = new THREE.Mesh(glowGeo, glowMat);
          glow.position.copy(marker.position);
          globeGroup.add(glow);
        }

        markerMeshes.push({ mesh: marker, glow, city });
        markerMapRef.current.set(city.id, city);
      }

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();

      const setHover = (cityId: string | null) => {
        const s = stateRef.current;
        if (s.hoveredId === cityId) return;
        s.hoveredId = cityId;
        for (const { mesh, glow, city } of markerMeshes) {
          const active = city.id === cityId;
          const isVisited = city.visited;
          const baseSize = isVisited ? MARKER_VISITED : MARKER_WISHLIST;
          const scale = active ? 1.5 : 1;
          mesh.scale.setScalar(scale);
          if (glow) glow.scale.setScalar(active ? 1.4 : 1);
        }
        const city = cityId ? markerMapRef.current.get(cityId) ?? null : null;
        callbacksRef.current.onCityHover?.(city);
      };

      const onPointerDown = (e: PointerEvent) => {
        const s = stateRef.current;
        s.isDragging = true;
        s.dragStartX = e.clientX;
        s.dragStartY = e.clientY;
        s.lastX = e.clientX;
        s.lastY = e.clientY;
        container.setPointerCapture(e.pointerId);
      };

      const onPointerMove = (e: PointerEvent) => {
        const s = stateRef.current;
        const rect = container.getBoundingClientRect();
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        if (s.isDragging) {
          const dx = e.clientX - s.lastX;
          const dy = e.clientY - s.lastY;
          s.lastX = e.clientX;
          s.lastY = e.clientY;
          s.targetRotY += dx * 0.005;
          s.targetRotX = Math.max(
            -0.8,
            Math.min(0.8, s.targetRotX + dy * 0.005)
          );
          s.rotY = s.targetRotY;
          s.rotX = s.targetRotX;
          return;
        }

        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(
          markerMeshes.map((m) => m.mesh)
        );
        setHover(
          hits.length > 0
            ? (hits[0].object.userData.cityId as string)
            : null
        );
        container.style.cursor = hits.length > 0 ? "pointer" : "grab";
      };

      const onPointerUp = (e: PointerEvent) => {
        const s = stateRef.current;
        const wasDragging =
          Math.abs(e.clientX - s.dragStartX) > 3 ||
          Math.abs(e.clientY - s.dragStartY) > 3;
        s.isDragging = false;
        container.releasePointerCapture(e.pointerId);

        if (!wasDragging && s.hoveredId) {
          const city = markerMapRef.current.get(s.hoveredId);
          if (city) callbacksRef.current.onCityClick?.(city);
        }
      };

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        const s = stateRef.current;
        s.targetZoom = Math.max(1.8, Math.min(4.5, s.targetZoom + e.deltaY * 0.002));
      };

      container.addEventListener("pointerdown", onPointerDown);
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerup", onPointerUp);
      container.addEventListener("pointerleave", () => setHover(null));
      container.addEventListener("wheel", onWheel, { passive: false });

      let raf = 0;
      let lastTime = performance.now();
      let pulsePhase = 0;

      const animate = (now: number) => {
        const dt = (now - lastTime) / 1000;
        lastTime = now;
        const s = stateRef.current;

        if (autoRotate && !reducedMotion && !s.isDragging) {
          s.targetRotY += AUTO_ROTATE_SPEED * dt;
        }

        s.rotX += (s.targetRotX - s.rotX) * 0.1;
        s.rotY = lerpAngle(s.rotY, s.targetRotY, 0.1);
        s.zoom += (s.targetZoom - s.zoom) * 0.08;

        globeGroup.rotation.x = s.rotX;
        globeGroup.rotation.y = s.rotY;
        camera.position.z = s.zoom;

        pulsePhase += dt * 2.5;
        const pulse = 0.85 + Math.sin(pulsePhase) * 0.15;
        for (const { glow, city } of markerMeshes) {
          if (glow && city.visited) {
            (glow.material as import("three").MeshBasicMaterial).opacity =
              city.id === s.hoveredId ? 0.45 : 0.18 + pulse * 0.08;
          }
        }

        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };

      raf = requestAnimationFrame(animate);

      const resize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w < 2 || h < 2) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      const ro = new ResizeObserver(resize);
      ro.observe(container);

      teardown = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        container.removeEventListener("pointerdown", onPointerDown);
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerup", onPointerUp);
        container.removeEventListener("wheel", onWheel);
        renderer.dispose();
        globeGeo.dispose();
        globeMat.dispose();
        colorMap.dispose();
        wireGeo.dispose();
        wireMat.dispose();
        atmoGeo.dispose();
        atmoMat.dispose();
        for (const { mesh, glow } of markerMeshes) {
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
          if (glow) {
            glow.geometry.dispose();
            (glow.material as THREE.Material).dispose();
          }
        }
        for (const arc of arcLines) {
          arc.geometry.dispose();
          (arc.material as THREE.Material).dispose();
        }
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    };

    boot();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [cities, autoRotate, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
      aria-hidden
    />
  );
}
