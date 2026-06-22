/**
 * Spring-based soft blob — vertices push away from pointer and bounce back.
 */

export class SoftBlobSimulation {
  readonly count: number;
  private readonly rest: Float32Array;
  private readonly vel: Float32Array;
  private readonly disp: Float32Array;
  private readonly positions: Float32Array;

  constructor(positions: Float32Array, count: number) {
    this.count = count;
    this.positions = positions;
    this.rest = new Float32Array(positions);
    this.vel = new Float32Array(count * 3);
    this.disp = new Float32Array(count * 3);
  }

  applyPointer(
    px: number,
    py: number,
    pz: number,
    radius: number,
    strength: number
  ) {
    const r2 = radius * radius;

    for (let i = 0; i < this.count; i++) {
      const ix = i * 3;
      const x = this.rest[ix] + this.disp[ix];
      const y = this.rest[ix + 1] + this.disp[ix + 1];
      const z = this.rest[ix + 2] + this.disp[ix + 2];

      const dx = x - px;
      const dy = y - py;
      const dz = z - pz;
      const dist2 = dx * dx + dy * dy + dz * dz;

      if (dist2 >= r2 || dist2 < 1e-8) continue;

      const dist = Math.sqrt(dist2);
      const t = 1 - dist / radius;
      const falloff = t * t * (3 - 2 * t);
      const push = (strength * falloff) / dist;

      this.vel[ix] += dx * push;
      this.vel[ix + 1] += dy * push;
      this.vel[ix + 2] += dz * push;
    }
  }

  applyDirectionalTilt(nx: number, ny: number, strength: number) {
    for (let i = 0; i < this.count; i++) {
      const ix = i * 3;
      this.vel[ix] += nx * strength * 0.018;
      this.vel[ix + 1] += ny * strength * 0.012;
    }
  }

  step(
    stiffness = 0.11,
    damping = 0.82,
    maxDisp = 0.42,
    breathe = 0
  ) {
    const { count, rest, vel, disp, positions } = this;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;

      vel[ix] += -disp[ix] * stiffness;
      vel[ix + 1] += -disp[ix + 1] * stiffness;
      vel[ix + 2] += -disp[ix + 2] * stiffness;

      vel[ix] *= damping;
      vel[ix + 1] *= damping;
      vel[ix + 2] *= damping;

      disp[ix] += vel[ix];
      disp[ix + 1] += vel[ix + 1];
      disp[ix + 2] += vel[ix + 2];

      const mag = Math.hypot(disp[ix], disp[ix + 1], disp[ix + 2]);
      if (mag > maxDisp) {
        const s = maxDisp / mag;
        disp[ix] *= s;
        disp[ix + 1] *= s;
        disp[ix + 2] *= s;
      }

      positions[ix] = rest[ix] * (1 + breathe * 0.04) + disp[ix];
      positions[ix + 1] = rest[ix + 1] * (1 + breathe * 0.05) + disp[ix + 1];
      positions[ix + 2] = rest[ix + 2] * (1 + breathe * 0.04) + disp[ix + 2];
    }
  }

  reset() {
    this.vel.fill(0);
    this.disp.fill(0);
    for (let i = 0; i < this.count * 3; i++) {
      this.positions[i] = this.rest[i];
    }
  }
}
