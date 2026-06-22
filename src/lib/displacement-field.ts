/**
 * Low-res displacement field with inertia — simulates soft membrane / liquid surface.
 * Values are uploaded to a GPU texture for shader-based UV distortion.
 */
export class DisplacementField {
  readonly size: number;
  private dispX: Float32Array;
  private dispY: Float32Array;
  private velX: Float32Array;
  private velY: Float32Array;
  private scratchX: Float32Array;
  private scratchY: Float32Array;
  readonly textureData: Float32Array;

  constructor(size = 64) {
    this.size = size;
    const len = size * size;
    this.dispX = new Float32Array(len);
    this.dispY = new Float32Array(len);
    this.velX = new Float32Array(len);
    this.velY = new Float32Array(len);
    this.scratchX = new Float32Array(len);
    this.scratchY = new Float32Array(len);
    this.textureData = new Float32Array(len * 4);
  }

  applyPointer(
    nx: number,
    ny: number,
    pvx: number,
    pvy: number,
    radius: number,
    strength: number
  ) {
    const { size } = this;
    const r2 = radius * radius;

    for (let j = 0; j < size; j++) {
      const v = (j + 0.5) / size;
      const dy = v - ny;

      for (let i = 0; i < size; i++) {
        const u = (i + 0.5) / size;
        const dx = u - nx;
        const dist2 = dx * dx + dy * dy;

        if (dist2 >= r2) continue;

        const t = 1 - Math.sqrt(dist2) / radius;
        const falloff = t * t * (3 - 2 * t);
        const idx = j * size + i;

        const radial = dist2 > 1e-6 ? 1 / Math.sqrt(dist2) : 0;
        const pushX = dx * radial * falloff * strength * 0.4;
        const pushY = dy * radial * falloff * strength * 0.4;

        this.velX[idx] += pvx * falloff * strength + pushX;
        this.velY[idx] += pvy * falloff * strength + pushY;
      }
    }
  }

  step(spring = 0.045, damping = 0.86, diffusion = 0.22) {
    const { size, dispX, dispY, velX, velY, scratchX, scratchY } = this;
    const len = size * size;

    for (let i = 0; i < len; i++) {
      velX[i] -= dispX[i] * spring;
      velY[i] -= dispY[i] * spring;
      velX[i] *= damping;
      velY[i] *= damping;
      dispX[i] += velX[i];
      dispY[i] += velY[i];
    }

    if (diffusion > 0) {
      for (let j = 0; j < size; j++) {
        for (let i = 0; i < size; i++) {
          const idx = j * size + i;
          let sx = dispX[idx];
          let sy = dispY[idx];
          let count = 1;

          if (i > 0) {
            const n = idx - 1;
            sx += dispX[n];
            sy += dispY[n];
            count++;
          }
          if (i < size - 1) {
            const n = idx + 1;
            sx += dispX[n];
            sy += dispY[n];
            count++;
          }
          if (j > 0) {
            const n = idx - size;
            sx += dispX[n];
            sy += dispY[n];
            count++;
          }
          if (j < size - 1) {
            const n = idx + size;
            sx += dispX[n];
            sy += dispY[n];
            count++;
          }

          scratchX[idx] = dispX[idx] + (sx / count - dispX[idx]) * diffusion;
          scratchY[idx] = dispY[idx] + (sy / count - dispY[idx]) * diffusion;
        }
      }

      dispX.set(scratchX);
      dispY.set(scratchY);
    }

    const tex = this.textureData;
    for (let i = 0; i < len; i++) {
      const ti = i * 4;
      tex[ti] = dispX[i];
      tex[ti + 1] = dispY[i];
      tex[ti + 2] = 0;
      tex[ti + 3] = 1;
    }
  }

  getActivity(): number {
    const { dispX, dispY, velX, velY } = this;
    let sum = 0;
    for (let i = 0; i < dispX.length; i++) {
      sum +=
        Math.abs(dispX[i]) +
        Math.abs(dispY[i]) +
        Math.abs(velX[i]) * 0.5 +
        Math.abs(velY[i]) * 0.5;
    }
    return sum / dispX.length;
  }
}
