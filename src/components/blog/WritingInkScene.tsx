"use client";

import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  boundsForAspect,
  createBouncerState,
  createMouseFollowState,
  stepMascotBouncer,
  stepMouseFollow,
  type BouncerBounds,
} from "@/lib/writing-mascot-bouncer";

type ThreeMaterial = import("three").Material;
type ThreeBufferGeometry = import("three").BufferGeometry;
type ThreeMesh = import("three").Mesh;

interface WritingInkSceneProps {
  className?: string;
  trackRef?: RefObject<HTMLElement | null>;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothRot(current: number, target: number, dt: number, smoothTime: number) {
  const t = 1 - Math.exp(-dt / Math.max(smoothTime, 0.001));
  return current + (target - current) * t;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function createNoteMascot(THREE: typeof import("three")) {
  const root = new THREE.Group();
  const bodyPivot = new THREE.Group();
  root.add(bodyPivot);

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: 0xd55559,
    roughness: 0.42,
    metalness: 0.02,
    clearcoat: 0.7,
    clearcoatRoughness: 0.25,
  });
  const headMat = new THREE.MeshPhysicalMaterial({
    color: 0xf1e500,
    roughness: 0.32,
    metalness: 0.02,
    clearcoat: 0.85,
    clearcoatRoughness: 0.18,
  });
  const earMat = new THREE.MeshStandardMaterial({
    color: 0xf1e500,
    roughness: 0.55,
  });
  const earTipMat = new THREE.MeshStandardMaterial({
    color: 0xd55559,
    roughness: 0.5,
  });
  const limbMat = new THREE.MeshStandardMaterial({
    color: 0xfaf8f4,
    roughness: 0.75,
  });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.35,
  });
  const shineMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.3,
  });
  const blushMat = new THREE.MeshStandardMaterial({
    color: 0xd55559,
    roughness: 0.85,
    transparent: true,
    opacity: 0.42,
  });
  const pencilMat = new THREE.MeshStandardMaterial({
    color: 0xf1e500,
    roughness: 0.45,
  });
  const leadMat = new THREE.MeshStandardMaterial({
    color: 0x4a4740,
    roughness: 0.6,
  });
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x1a1a1a,
    transparent: true,
    opacity: 0.1,
  });
  const notebookCoverMat = new THREE.MeshStandardMaterial({
    color: 0xd55559,
    roughness: 0.75,
  });
  const notebookPaperMat = new THREE.MeshStandardMaterial({
    color: 0xfaf8f4,
    roughness: 0.92,
  });

  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 24), bodyMat);
  torso.scale.set(1.05, 0.88, 0.92);
  torso.position.y = 0.02;
  bodyPivot.add(torso);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.46, 28, 28), headMat);
  head.position.y = 0.62;
  bodyPivot.add(head);

  const earGeo = new THREE.CapsuleGeometry(0.11, 0.38, 6, 12);
  const leftEar = new THREE.Mesh(earGeo, earMat);
  leftEar.position.set(-0.28, 1.02, -0.02);
  leftEar.rotation.z = 0.35;
  leftEar.rotation.x = -0.15;
  bodyPivot.add(leftEar);

  const rightEar = leftEar.clone();
  rightEar.position.x = 0.28;
  rightEar.rotation.z = -0.35;
  rightEar.rotation.x = -0.15;
  bodyPivot.add(rightEar);

  const tipGeo = new THREE.SphereGeometry(0.12, 12, 12);
  const leftEarTip = new THREE.Mesh(tipGeo, earTipMat);
  leftEarTip.position.set(-0.34, 1.28, -0.02);
  bodyPivot.add(leftEarTip);

  const rightEarTip = leftEarTip.clone();
  rightEarTip.position.x = 0.34;
  bodyPivot.add(rightEarTip);

  const eyeGeo = new THREE.SphereGeometry(0.075, 14, 14);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.16, 0.68, 0.38);
  bodyPivot.add(leftEye);

  const rightEye = leftEye.clone();
  rightEye.position.x = 0.16;
  bodyPivot.add(rightEye);

  const shineGeo = new THREE.SphereGeometry(0.024, 8, 8);
  const leftShine = new THREE.Mesh(shineGeo, shineMat);
  leftShine.position.set(-0.13, 0.72, 0.43);
  bodyPivot.add(leftShine);

  const rightShine = leftShine.clone();
  rightShine.position.x = 0.19;
  bodyPivot.add(rightShine);

  const blushGeo = new THREE.SphereGeometry(0.08, 10, 10);
  const leftBlush = new THREE.Mesh(blushGeo, blushMat);
  leftBlush.position.set(-0.3, 0.56, 0.34);
  leftBlush.scale.set(1.2, 0.7, 0.45);
  bodyPivot.add(leftBlush);

  const rightBlush = leftBlush.clone();
  rightBlush.position.x = 0.3;
  bodyPivot.add(rightBlush);

  const smileGroup = new THREE.Group();
  smileGroup.position.set(0, 0.47, 0.42);
  bodyPivot.add(smileGroup);

  const smileSoftMat = new THREE.MeshStandardMaterial({
    color: 0xd55559,
    roughness: 0.75,
    transparent: true,
    opacity: 0.32,
  });

  const smileMain = new THREE.Mesh(
    new THREE.TorusGeometry(0.088, 0.014, 10, 24, Math.PI * 0.82),
    eyeMat
  );
  smileMain.rotation.x = Math.PI;
  smileGroup.add(smileMain);

  const smileSoft = new THREE.Mesh(
    new THREE.TorusGeometry(0.062, 0.007, 8, 18, Math.PI * 0.55),
    smileSoftMat
  );
  smileSoft.position.set(0, 0.014, 0.003);
  smileSoft.rotation.x = Math.PI;
  smileGroup.add(smileSoft);

  const dimpleGeo = new THREE.SphereGeometry(0.018, 8, 8);
  const leftDimple = new THREE.Mesh(dimpleGeo, blushMat);
  leftDimple.position.set(-0.1, -0.008, 0.01);
  leftDimple.scale.set(1.2, 0.7, 0.5);
  smileGroup.add(leftDimple);

  const rightDimple = leftDimple.clone();
  rightDimple.position.x = 0.1;
  smileGroup.add(rightDimple);

  const footGeo = new THREE.SphereGeometry(0.11, 12, 12);
  const leftFoot = new THREE.Mesh(footGeo, limbMat);
  leftFoot.position.set(-0.18, -0.28, 0.08);
  leftFoot.scale.set(1.1, 0.75, 1.25);
  bodyPivot.add(leftFoot);

  const rightFoot = leftFoot.clone();
  rightFoot.position.x = 0.18;
  bodyPivot.add(rightFoot);

  const leftArm = new THREE.Group();
  leftArm.position.set(-0.36, 0.14, 0.04);
  bodyPivot.add(leftArm);

  const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), limbMat);
  leftArm.add(leftHand);

  const notebook = new THREE.Group();
  notebook.position.set(-0.04, -0.06, 0.14);
  notebook.rotation.set(0.15, 0.55, -0.35);
  leftArm.add(notebook);

  const notebookCover = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.3, 0.035),
    notebookCoverMat
  );
  notebook.add(notebookCover);

  const notebookPage = new THREE.Mesh(
    new THREE.BoxGeometry(0.21, 0.27, 0.02),
    notebookPaperMat
  );
  notebookPage.position.set(0.015, 0, 0.02);
  notebook.add(notebookPage);

  const lineMat = new THREE.MeshStandardMaterial({ color: 0xd55559 });
  const line1 = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.012), lineMat);
  line1.position.set(0.02, 0.06, 0.035);
  notebook.add(line1);
  const line2 = line1.clone();
  line2.position.y = 0;
  line2.scale.x = 0.85;
  notebook.add(line2);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.36, 0.14, 0.04);
  bodyPivot.add(rightArm);

  const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), limbMat);
  rightArm.add(rightHand);

  const pencil = new THREE.Group();
  pencil.position.set(0.04, -0.1, 0.12);
  pencil.rotation.set(0.35, -0.15, -0.55);
  rightArm.add(pencil);

  const pencilBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.028, 0.36, 10),
    pencilMat
  );
  pencilBody.position.y = 0.1;
  pencil.add(pencilBody);

  const pencilTip = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.08, 10), leadMat);
  pencilTip.position.y = -0.1;
  pencilTip.rotation.x = Math.PI;
  pencil.add(pencilTip);

  const eraser = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.05, 10),
    new THREE.MeshStandardMaterial({ color: 0xd55559, roughness: 0.6 })
  );
  eraser.position.y = 0.22;
  pencil.add(eraser);

  const shadow = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  root.add(shadow);

  const disposables: Array<ThreeMaterial | ThreeBufferGeometry> = [
    bodyMat,
    headMat,
    earMat,
    earTipMat,
    limbMat,
    eyeMat,
    shineMat,
    blushMat,
    smileSoftMat,
    pencilMat,
    leadMat,
    shadowMat,
    notebookCoverMat,
    notebookPaperMat,
    lineMat,
    earGeo,
    eyeGeo,
    shineGeo,
    blushGeo,
    footGeo,
    torso.geometry,
    head.geometry,
    tipGeo,
    smileMain.geometry,
    smileSoft.geometry,
    dimpleGeo,
    pencilBody.geometry,
    pencilTip.geometry,
    eraser.geometry,
    notebookCover.geometry,
    notebookPage.geometry,
    line1.geometry,
    shadow.geometry,
  ];

  return {
    root,
    bodyPivot,
    parts: {
      leftEar,
      rightEar,
      leftEarTip,
      rightEarTip,
      leftFoot,
      rightFoot,
      leftArm,
      rightArm,
      leftEye,
      rightEye,
      shadow,
      notebook,
      smileGroup,
      head,
    },
    disposables,
  };
}

function createStageDecor(
  THREE: typeof import("three"),
  bounds: BouncerBounds
) {
  const decor = new THREE.Group();
  const span = bounds.maxX - bounds.minX;
  const disposables: Array<ThreeMaterial | ThreeBufferGeometry | ThreeMesh> = [];

  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xfaf8f4,
    roughness: 0.95,
    transparent: true,
    opacity: 0.55,
  });
  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(span * 0.52, 48),
    floorMat
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = bounds.floorY - 0.02;
  decor.add(floor);
  disposables.push(floorMat, floor.geometry, floor);

  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xf1e500,
    transparent: true,
    opacity: 0.18,
  });
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(span * 0.38, span * 0.52, 64),
    ringMat
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = bounds.floorY - 0.015;
  decor.add(ring);
  disposables.push(ringMat, ring.geometry, ring);

  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xfaf8f4,
    roughness: 0.92,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75,
  });
  const inkMat = new THREE.MeshStandardMaterial({
    color: 0xd55559,
    transparent: true,
    opacity: 0.5,
  });

  const paperLayouts = [
    { x: -span * 0.38, y: 0.55, z: -0.35, ry: 0.4, s: 0.85 },
    { x: span * 0.42, y: 0.35, z: -0.25, ry: -0.55, s: 0.7 },
    { x: -span * 0.15, y: 0.95, z: -0.5, ry: 0.15, s: 0.6 },
    { x: span * 0.2, y: -0.15, z: -0.4, ry: -0.2, s: 0.75 },
    { x: span * 0.05, y: 0.7, z: -0.55, ry: 0.65, s: 0.55 },
  ];

  for (const layout of paperLayouts) {
    const g = new THREE.Group();
    g.position.set(layout.x, layout.y, layout.z);
    g.rotation.y = layout.ry;
    g.scale.setScalar(layout.s);

    const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.72), paperMat);
    g.add(sheet);

    const stroke = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.015), inkMat);
    stroke.position.set(0.04, 0.12, 0.002);
    g.add(stroke);

    decor.add(g);
    disposables.push(sheet, stroke);
  }

  const bookMat = new THREE.MeshStandardMaterial({
    color: 0xd55559,
    roughness: 0.7,
  });
  const bookStack = new THREE.Group();
  bookStack.position.set(-span * 0.42, bounds.floorY + 0.12, -0.45);
  for (let i = 0; i < 3; i++) {
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.08, 0.22),
      bookMat
    );
    book.position.y = i * 0.09;
    book.rotation.y = 0.25;
    bookStack.add(book);
    disposables.push(book);
  }
  decor.add(bookStack);
  disposables.push(bookMat);
  bookStack.children.forEach((book) => {
    if ("geometry" in book) disposables.push(book.geometry as ThreeBufferGeometry);
  });

  const mugMat = new THREE.MeshStandardMaterial({
    color: 0xfaf8f4,
    roughness: 0.8,
  });
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.11, 0.18, 16), mugMat);
  mug.position.set(span * 0.38, bounds.floorY + 0.1, -0.35);
  decor.add(mug);
  disposables.push(mugMat, mug.geometry, mug);

  const plantPot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.11, 0.14, 12),
    new THREE.MeshStandardMaterial({ color: 0xd55559, roughness: 0.75 })
  );
  plantPot.position.set(span * 0.45, bounds.floorY + 0.08, 0.15);
  decor.add(plantPot);

  const leafMat = new THREE.MeshStandardMaterial({ color: 0xf1e500, roughness: 0.6 });
  for (let i = 0; i < 3; i++) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), leafMat);
    leaf.position.set(
      span * 0.45 + Math.cos(i * 2.1) * 0.06,
      bounds.floorY + 0.22 + i * 0.03,
      0.15 + Math.sin(i * 2.1) * 0.06
    );
    leaf.scale.set(1, 1.4, 0.6);
    decor.add(leaf);
    disposables.push(leaf);
  }

  disposables.push(plantPot.geometry, plantPot.material as ThreeMaterial, leafMat);

  return { decor, disposables, paperMat, inkMat };
}

export function WritingInkScene({
  className,
  trackRef,
}: WritingInkSceneProps) {
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
    const pendingPointer = { x: 0, y: 0, known: false };

    const capturePointer = (e: PointerEvent) => {
      pendingPointer.x = e.clientX;
      pendingPointer.y = e.clientY;
      pendingPointer.known = true;
    };

    window.addEventListener("pointermove", capturePointer, { passive: true });

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
      const aspect = width / height;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 40);
      camera.position.set(0, 0.25, 6.5);
      camera.lookAt(0, -0.05, 0);

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
      renderer.toneMappingExposure = 1.08;

      const stage = new THREE.Group();
      scene.add(stage);

      let bounds = boundsForAspect(aspect);
      const stageDecor = createStageDecor(THREE, bounds);
      stage.add(stageDecor.decor);

      const mascot = createNoteMascot(THREE);
      stage.add(mascot.root);

      const bouncer = createBouncerState(bounds, 0.4, 0);
      const mouseFollow = createMouseFollowState(bouncer.x, bouncer.z);

      const raycaster = new THREE.Raycaster();
      const pointerNdc = new THREE.Vector2();
      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -bounds.floorY);
      const hitPoint = new THREE.Vector3();
      const trackNorm = { x: 0.5, y: 0.5 };

      const starMat = new THREE.MeshStandardMaterial({
        color: 0xf1e500,
        emissive: 0xf1e500,
        emissiveIntensity: 0.45,
        roughness: 0.45,
      });
      const stars: ThreeMesh[] = [];
      const span = bounds.maxX - bounds.minX;
      for (let i = 0; i < 8; i++) {
        const star = new THREE.Mesh(new THREE.OctahedronGeometry(0.06, 0), starMat);
        star.userData = {
          bx: (Math.random() - 0.5) * span * 1.1,
          by: 0.3 + Math.random() * 1.4,
          bz: -0.3 - Math.random() * 0.4,
          speed: 0.5 + Math.random() * 0.7,
          phase: Math.random() * Math.PI * 2,
        };
        stars.push(star);
        stage.add(star);
      }

      scene.add(new THREE.AmbientLight(0xfff5e8, 1.05));
      const key = new THREE.DirectionalLight(0xffffff, 1.15);
      key.position.set(2, 5, 4);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xf1e500, 0.4);
      fill.position.set(-3, 1, 2);
      scene.add(fill);

      let raf = 0;
      let lastFrame = performance.now();
      let time = 0;

      const syncFloorPlane = () => {
        floorPlane.set(new THREE.Vector3(0, 1, 0), -bounds.floorY);
      };

      const updatePointerTarget = (clientX: number, clientY: number) => {
        const rect = trackEl.getBoundingClientRect();
        const inside =
          clientX >= rect.left &&
          clientX <= rect.right &&
          clientY >= rect.top &&
          clientY <= rect.bottom;

        if (!inside) {
          mouseFollow.active = false;
          return;
        }

        trackNorm.x = (clientX - rect.left) / rect.width;
        trackNorm.y = (clientY - rect.top) / rect.height;

        pointerNdc.x = trackNorm.x * 2 - 1;
        pointerNdc.y = -(trackNorm.y * 2 - 1);

        raycaster.setFromCamera(pointerNdc, camera);
        if (!raycaster.ray.intersectPlane(floorPlane, hitPoint)) return;

        const wasActive = mouseFollow.active;
        mouseFollow.active = true;
        mouseFollow.targetX = clamp(hitPoint.x, bounds.minX, bounds.maxX);
        mouseFollow.targetZ = clamp(hitPoint.z, bounds.minZ, bounds.maxZ);

        if (!wasActive) {
          mouseFollow.smoothX = mouseFollow.targetX;
          mouseFollow.smoothZ = mouseFollow.targetZ;
        }
      };

      const onWindowPointerMove = (e: PointerEvent) => {
        updatePointerTarget(e.clientX, e.clientY);
      };

      const loop = (now: number) => {
        const dt = Math.min((now - lastFrame) / 1000, 0.032);
        lastFrame = now;
        time = now * 0.001;

        const following = mouseFollow.active
          ? stepMouseFollow(bouncer, bounds, mouseFollow, dt, time)
          : false;
        if (!following) {
          stepMascotBouncer(bouncer, bounds, dt, reduce ?? false);
        }

        mascot.root.position.set(bouncer.x, bouncer.y, bouncer.z);
        mascot.root.rotation.y = smoothRot(
          mascot.root.rotation.y,
          bouncer.facing === 1 ? -0.12 : 0.12,
          dt,
          0.16
        );

        const air = bouncer.grounded && !bouncer.walking ? 0 : bouncer.walking ? 0.35 : 1;
        const squashY = 1 + bouncer.squash;
        const squashX = 1 - bouncer.squash * 0.45;
        mascot.bodyPivot.scale.set(squashX, squashY, squashX);

        const { parts } = mascot;
        const walk = bouncer.walking ? bouncer.walkPhase : 0;

        if (bouncer.walking) {
          const swing = Math.sin(walk);
          parts.leftFoot.position.set(-0.18, -0.28 + Math.max(0, swing) * 0.05, 0.08 + swing * 0.07);
          parts.rightFoot.position.set(0.18, -0.28 + Math.max(0, -swing) * 0.05, 0.08 - swing * 0.07);
          parts.leftArm.rotation.x = smoothRot(parts.leftArm.rotation.x, swing * 0.35, dt, 0.1);
          parts.rightArm.rotation.x = smoothRot(parts.rightArm.rotation.x, -swing * 0.35, dt, 0.1);
          parts.leftArm.rotation.z = smoothRot(parts.leftArm.rotation.z, 0.15, dt, 0.12);
          parts.rightArm.rotation.z = smoothRot(parts.rightArm.rotation.z, -0.12, dt, 0.12);
          mascot.bodyPivot.rotation.z = smoothRot(
            mascot.bodyPivot.rotation.z,
            Math.sin(walk * 2) * 0.04,
            dt,
            0.12
          );
        } else {
          parts.leftFoot.position.set(-0.18, -0.28 + air * 0.12, 0.08);
          parts.rightFoot.position.set(0.18, -0.28 + air * 0.1, 0.08);
          parts.leftArm.rotation.x = smoothRot(parts.leftArm.rotation.x, air * 0.5, dt, 0.12);
          parts.rightArm.rotation.x = smoothRot(parts.rightArm.rotation.x, -air * 0.4, dt, 0.12);
          parts.leftArm.rotation.z = smoothRot(parts.leftArm.rotation.z, air * 0.25, dt, 0.12);
          parts.rightArm.rotation.z = smoothRot(parts.rightArm.rotation.z, -air * 0.2, dt, 0.12);
          mascot.bodyPivot.rotation.z = smoothRot(mascot.bodyPivot.rotation.z, 0, dt, 0.12);
        }

        const lookX = clamp((mouseFollow.smoothX - bouncer.x) * 0.06, -0.035, 0.035);
        const lookY = clamp((mouseFollow.smoothZ - bouncer.z) * -0.04, -0.02, 0.02);
        parts.leftEye.position.set(-0.16 + lookX, 0.68 + lookY * 0.5, 0.38);
        parts.rightEye.position.set(0.16 + lookX, 0.68 + lookY * 0.5, 0.38);
        parts.head.rotation.y = smoothRot(parts.head.rotation.y, lookX * 2.5, dt, 0.14);
        parts.head.rotation.x = smoothRot(parts.head.rotation.x, lookY, dt, 0.14);
        parts.smileGroup.scale.setScalar(1 + (bouncer.walking ? 0.04 : 0.02));

        parts.leftEar.rotation.z =
          0.35 + Math.sin(time * 8 + bouncer.hopPhase * 12) * 0.07 * (1 + air);
        parts.rightEar.rotation.z =
          -0.35 - Math.sin(time * 8 + bouncer.hopPhase * 12) * 0.07 * (1 + air);
        parts.leftEarTip.position.set(-0.34, 1.28 + air * 0.04, -0.02);
        parts.rightEarTip.position.set(0.34, 1.28 + air * 0.04, -0.02);

        const shadowScale = bouncer.grounded
          ? 1 - bouncer.squash * 0.35
          : Math.max(0.3, 1 - (bouncer.y - bounds.floorY) * 0.55);
        parts.shadow.scale.set(shadowScale, shadowScale, 1);
        parts.shadow.position.set(0, bounds.floorY - bouncer.y + 0.01, 0);

        if (!reduce) {
          const dx = (trackNorm.x - 0.5) * 2;
          stage.rotation.y = smoothRot(stage.rotation.y, dx * 0.035, dt, 0.2);

          stageDecor.decor.children.forEach((child, i) => {
            if (child.type === "Group" && i < 5) {
              child.position.y += Math.sin(time * 0.8 + i) * 0.0004;
              child.rotation.z = Math.sin(time * 0.6 + i * 1.3) * 0.03;
            }
          });

          for (const star of stars) {
            const s = star.userData as {
              bx: number;
              by: number;
              bz: number;
              speed: number;
              phase: number;
            };
            star.position.set(
              s.bx + Math.sin(time * s.speed + s.phase) * 0.1,
              s.by + Math.sin(time * s.speed * 1.3 + s.phase) * 0.06,
              s.bz
            );
            star.rotation.x = time * 1.8;
            star.rotation.y = time * 1.2;
          }
        }

        renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };

      raf = requestAnimationFrame(loop);

      const resize = () => {
        const w = root.clientWidth;
        const h = root.clientHeight;
        if (w < 2 || h < 2) return;
        const nextAspect = w / h;
        camera.aspect = nextAspect;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        bounds = boundsForAspect(nextAspect);
        syncFloorPlane();
      };

      syncFloorPlane();
      window.removeEventListener("pointermove", capturePointer);
      if (pendingPointer.known) {
        updatePointerTarget(pendingPointer.x, pendingPointer.y);
      }
      const ro = new ResizeObserver(resize);
      ro.observe(root);
      window.addEventListener("pointermove", onWindowPointerMove, { passive: true });

      teardown = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener("pointermove", onWindowPointerMove);
        starMat.dispose();
        stars.forEach((s) => s.geometry.dispose());
        stageDecor.paperMat.dispose();
        stageDecor.inkMat.dispose();
        stageDecor.disposables.forEach((item) => {
          if ("dispose" in item && typeof item.dispose === "function") {
            item.dispose();
          }
        });
        mascot.disposables.forEach((item) => item.dispose());
        renderer.dispose();
      };
    };

    boot();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      window.removeEventListener("pointermove", capturePointer);
      teardown?.();
    };
  }, [reduce, trackRef]);

  return (
    <div
      ref={rootRef}
      className={cn("writing-ink-scene writing-ink-scene--free relative", className)}
      aria-hidden
    >
      <canvas ref={canvasRef} className="block h-full w-full touch-none" />
    </div>
  );
}
