import type * as THREE from "three";
import {
  advectShader,
  curlShader,
  divergenceShader,
  displayShader,
  fluidVertexShader,
  gradientSubtractShader,
  pressureShader,
  splatShader,
  vorticityShader,
} from "./fluid-shaders";

const PRESSURE_ITERATIONS = 28;
const SPLAT_RADIUS = 0.0042;

interface HeroFluidOptions {
  reducedMotion?: boolean;
}

class DoubleFBO {
  read: THREE.WebGLRenderTarget;
  write: THREE.WebGLRenderTarget;

  constructor(
    width: number,
    height: number,
    type: THREE.TextureDataType,
    THREE: typeof import("three")
  ) {
    const opts: THREE.RenderTargetOptions = {
      type,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    };
    this.read = new THREE.WebGLRenderTarget(width, height, opts);
    this.write = new THREE.WebGLRenderTarget(width, height, opts);
  }

  swap() {
    const tmp = this.read;
    this.read = this.write;
    this.write = tmp;
  }

  dispose() {
    this.read.dispose();
    this.write.dispose();
  }
}

export class HeroFluidSimulation {
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.OrthographicCamera;
  private scene: THREE.Scene;
  private mesh: THREE.Mesh;
  private velocity: DoubleFBO;
  private pressure: DoubleFBO;
  private dye: DoubleFBO;
  private curlRT: THREE.WebGLRenderTarget;
  private divergenceRT: THREE.WebGLRenderTarget;

  private splatMat: THREE.ShaderMaterial;
  private advectMat: THREE.ShaderMaterial;
  private divergenceMat: THREE.ShaderMaterial;
  private pressureMat: THREE.ShaderMaterial;
  private gradientMat: THREE.ShaderMaterial;
  private curlMat: THREE.ShaderMaterial;
  private vorticityMat: THREE.ShaderMaterial;
  private displayMat: THREE.ShaderMaterial;

  private simW = 0;
  private simH = 0;
  private aspect = 1;
  private texelSize = { x: 0, y: 0 };
  private readonly texelVec: THREE.Vector2;
  private readonly THREE: typeof import("three");
  private readonly reducedMotion: boolean;

  constructor(
    THREE: typeof import("three"),
    canvas: HTMLCanvasElement,
    displayWidth: number,
    displayHeight: number,
    options: HeroFluidOptions = {}
  ) {
    this.THREE = THREE;
    this.reducedMotion = options.reducedMotion ?? false;
    this.texelVec = new THREE.Vector2();

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    this.renderer.setClearColor(0xe8e4dc, 1);
    this.renderer.autoClear = true;

    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new THREE.Scene();
    const geometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(geometry);
    this.scene.add(this.mesh);

    const type = this.renderer.capabilities.isWebGL2
      ? THREE.HalfFloatType
      : THREE.UnsignedByteType;

    this.velocity = new DoubleFBO(1, 1, type, THREE);
    this.pressure = new DoubleFBO(1, 1, type, THREE);
    this.dye = new DoubleFBO(1, 1, type, THREE);
    this.curlRT = new THREE.WebGLRenderTarget(1, 1, {
      type,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    this.divergenceRT = new THREE.WebGLRenderTarget(1, 1, {
      type,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });

    this.splatMat = new THREE.ShaderMaterial({
      uniforms: {
        uTarget: { value: null },
        uAspect: { value: 1 },
        uPoint: { value: new THREE.Vector3() },
        uColor: { value: new THREE.Vector3() },
        uRadius: { value: SPLAT_RADIUS },
      },
      vertexShader: fluidVertexShader,
      fragmentShader: splatShader,
      depthTest: false,
      depthWrite: false,
    });

    this.advectMat = new THREE.ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uSource: { value: null },
        uTexelSize: { value: this.texelVec },
        uDissipation: { value: 1 },
        uDt: { value: 0 },
      },
      vertexShader: fluidVertexShader,
      fragmentShader: advectShader,
      depthTest: false,
      depthWrite: false,
    });

    this.divergenceMat = new THREE.ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uTexelSize: { value: this.texelVec },
      },
      vertexShader: fluidVertexShader,
      fragmentShader: divergenceShader,
      depthTest: false,
      depthWrite: false,
    });

    this.pressureMat = new THREE.ShaderMaterial({
      uniforms: {
        uPressure: { value: null },
        uDivergence: { value: null },
        uTexelSize: { value: this.texelVec },
      },
      vertexShader: fluidVertexShader,
      fragmentShader: pressureShader,
      depthTest: false,
      depthWrite: false,
    });

    this.gradientMat = new THREE.ShaderMaterial({
      uniforms: {
        uPressure: { value: null },
        uVelocity: { value: null },
        uTexelSize: { value: this.texelVec },
      },
      vertexShader: fluidVertexShader,
      fragmentShader: gradientSubtractShader,
      depthTest: false,
      depthWrite: false,
    });

    this.curlMat = new THREE.ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uTexelSize: { value: this.texelVec },
      },
      vertexShader: fluidVertexShader,
      fragmentShader: curlShader,
      depthTest: false,
      depthWrite: false,
    });

    this.vorticityMat = new THREE.ShaderMaterial({
      uniforms: {
        uVelocity: { value: null },
        uCurl: { value: null },
        uTexelSize: { value: this.texelVec },
        uCurlStrength: { value: 30 },
        uDt: { value: 0 },
      },
      vertexShader: fluidVertexShader,
      fragmentShader: vorticityShader,
      depthTest: false,
      depthWrite: false,
    });

    this.displayMat = new THREE.ShaderMaterial({
      uniforms: {
        uDye: { value: null },
        uVelocity: { value: null },
        uTime: { value: 0 },
      },
      vertexShader: fluidVertexShader,
      fragmentShader: displayShader,
      depthTest: false,
      depthWrite: false,
    });

    this.resize(displayWidth, displayHeight);
  }

  resize(displayWidth: number, displayHeight: number) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(displayWidth, displayHeight, false);

    const simScale = displayWidth < 640 ? 0.45 : 0.5;
    const simW = Math.max(
      128,
      Math.min(320, Math.floor(displayWidth * simScale))
    );
    const simH = Math.max(
      128,
      Math.min(320, Math.floor(displayHeight * simScale))
    );

    if (simW === this.simW && simH === this.simH) return;

    this.simW = simW;
    this.simH = simH;
    this.aspect = simW / simH;
    this.texelSize.x = 1 / simW;
    this.texelSize.y = 1 / simH;
    this.texelVec.set(this.texelSize.x, this.texelSize.y);

    this.velocity.dispose();
    this.pressure.dispose();
    this.dye.dispose();
    this.curlRT.dispose();
    this.divergenceRT.dispose();

    const type = this.renderer.capabilities.isWebGL2
      ? this.THREE.HalfFloatType
      : this.THREE.UnsignedByteType;

    this.velocity = new DoubleFBO(simW, simH, type, this.THREE);
    this.pressure = new DoubleFBO(simW, simH, type, this.THREE);
    this.dye = new DoubleFBO(simW, simH, type, this.THREE);
    this.curlRT = new this.THREE.WebGLRenderTarget(simW, simH, {
      type,
      format: this.THREE.RGBAFormat,
      minFilter: this.THREE.LinearFilter,
      magFilter: this.THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    this.divergenceRT = new this.THREE.WebGLRenderTarget(simW, simH, {
      type,
      format: this.THREE.RGBAFormat,
      minFilter: this.THREE.LinearFilter,
      magFilter: this.THREE.LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });

    this.splatMat.uniforms.uAspect.value = this.aspect;
  }

  private blit(
    material: THREE.ShaderMaterial,
    target: THREE.WebGLRenderTarget | null
  ) {
    this.mesh.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  private splat(
    target: DoubleFBO,
    x: number,
    y: number,
    color: THREE.Vector3,
    radius = SPLAT_RADIUS
  ) {
    this.splatMat.uniforms.uTarget.value = target.read.texture;
    this.splatMat.uniforms.uPoint.value.set(x, y, 0);
    this.splatMat.uniforms.uColor.value.copy(color);
    this.splatMat.uniforms.uRadius.value = radius;
    this.blit(this.splatMat, target.write);
    target.swap();
  }

  injectForce(
    x: number,
    y: number,
    dx: number,
    dy: number,
    dyeAmount = 1
  ) {
    const force = new this.THREE.Vector3(dx, dy, 0);
    this.splat(this.velocity, x, y, force, SPLAT_RADIUS * 1.15);

    if (dyeAmount > 0) {
      const ink = new this.THREE.Vector3(
        (0.07 + Math.min(Math.hypot(dx, dy) * 5, 0.14)) * dyeAmount,
        0,
        0
      );
      this.splat(this.dye, x, y, ink, SPLAT_RADIUS * 2.8);
    }
  }

  seedField() {
    const splats = [
      { x: 0.35, y: 0.55, dx: 28, dy: -16 },
      { x: 0.62, y: 0.42, dx: -22, dy: 18 },
      { x: 0.48, y: 0.68, dx: 14, dy: -22 },
      { x: 0.72, y: 0.58, dx: -18, dy: -14 },
      { x: 0.28, y: 0.38, dx: 24, dy: 20 },
    ];
    for (const s of splats) {
      this.injectForce(s.x, s.y, s.dx, s.dy, 0.38);
    }
  }

  injectAmbient(time: number) {
    const amp = this.reducedMotion ? 0.45 : 1;
    const x = 0.5 + Math.sin(time * 0.21) * 0.32;
    const y = 0.5 + Math.cos(time * 0.17) * 0.28;
    const dx = Math.sin(time * 1.1) * 14 * amp;
    const dy = Math.cos(time * 0.85) * 14 * amp;
    const force = new this.THREE.Vector3(dx, dy, 0);
    this.splat(this.velocity, x, y, force, SPLAT_RADIUS * 1.1);

    const x2 = 0.5 + Math.cos(time * 0.13) * 0.25;
    const y2 = 0.5 + Math.sin(time * 0.19) * 0.22;
    const force2 = new this.THREE.Vector3(
      Math.sin(time * 0.7) * 8 * amp,
      Math.cos(time * 0.55) * 8 * amp,
      0
    );
    this.splat(this.velocity, x2, y2, force2, SPLAT_RADIUS * 0.9);
  }

  step(dt: number, time: number) {
    const clampedDt = Math.min(dt, 0.033);
    this.injectAmbient(time);
    this.advectMat.uniforms.uDt.value = clampedDt;
    this.vorticityMat.uniforms.uDt.value = clampedDt;

    this.curlMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this.blit(this.curlMat, this.curlRT);

    this.vorticityMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this.vorticityMat.uniforms.uCurl.value = this.curlRT.texture;
    this.blit(this.vorticityMat, this.velocity.write);
    this.velocity.swap();

    this.advectMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this.advectMat.uniforms.uSource.value = this.velocity.read.texture;
    this.advectMat.uniforms.uDissipation.value = 0.985;
    this.blit(this.advectMat, this.velocity.write);
    this.velocity.swap();

    this.divergenceMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this.blit(this.divergenceMat, this.divergenceRT);

    this.pressureMat.uniforms.uDivergence.value = this.divergenceRT.texture;
    this.blit(this.pressureMat, this.pressure.write);
    this.pressure.swap();

    for (let i = 0; i < PRESSURE_ITERATIONS; i++) {
      this.pressureMat.uniforms.uPressure.value = this.pressure.read.texture;
      this.blit(this.pressureMat, this.pressure.write);
      this.pressure.swap();
    }

    this.gradientMat.uniforms.uPressure.value = this.pressure.read.texture;
    this.gradientMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this.blit(this.gradientMat, this.velocity.write);
    this.velocity.swap();

    this.advectMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this.advectMat.uniforms.uSource.value = this.dye.read.texture;
    this.advectMat.uniforms.uDissipation.value = 0.994;
    this.blit(this.advectMat, this.dye.write);
    this.dye.swap();

    this.displayMat.uniforms.uDye.value = this.dye.read.texture;
    this.displayMat.uniforms.uVelocity.value = this.velocity.read.texture;
    this.displayMat.uniforms.uTime.value = time;
    this.blit(this.displayMat, null);
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.splatMat.dispose();
    this.advectMat.dispose();
    this.divergenceMat.dispose();
    this.pressureMat.dispose();
    this.gradientMat.dispose();
    this.curlMat.dispose();
    this.vorticityMat.dispose();
    this.displayMat.dispose();
    this.velocity.dispose();
    this.pressure.dispose();
    this.dye.dispose();
    this.curlRT.dispose();
    this.divergenceRT.dispose();
    this.renderer.dispose();
  }
}
