/** Cute mascot — mouse follow + idle wander with smooth motion. */

export interface BouncerBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  floorY: number;
  jumpMin: number;
  jumpMax: number;
}

export interface BouncerState {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  grounded: boolean;
  wait: number;
  squash: number;
  facing: number;
  hopPhase: number;
  walking: boolean;
  walkPhase: number;
  targetX: number;
  targetZ: number;
}

export interface MouseFollowState {
  active: boolean;
  targetX: number;
  targetZ: number;
  smoothX: number;
  smoothZ: number;
}

export function createMouseFollowState(x = 0, z = 0): MouseFollowState {
  return { active: false, targetX: x, targetZ: z, smoothX: x, smoothZ: z };
}

export function createBouncerState(
  bounds: BouncerBounds,
  x = 0,
  z = 0
): BouncerState {
  return {
    x,
    y: bounds.floorY,
    z,
    vx: 0,
    vy: 0,
    vz: 0,
    grounded: true,
    wait: 0.15,
    squash: 0,
    facing: 1,
    hopPhase: 0,
    walking: false,
    walkPhase: 0,
    targetX: x,
    targetZ: z,
  };
}

function pickHopTarget(bounds: BouncerBounds) {
  return {
    x: bounds.minX + Math.random() * (bounds.maxX - bounds.minX),
    z: bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ),
  };
}

function pickWalkTarget(state: BouncerState, bounds: BouncerBounds) {
  const goRight = state.x < (bounds.minX + bounds.maxX) * 0.5;
  const margin = 0.25;
  return {
    x: goRight ? bounds.maxX - margin : bounds.minX + margin,
    z: bounds.minZ + Math.random() * (bounds.maxZ - bounds.minZ),
  };
}

export function launchMascotToward(
  state: BouncerState,
  bounds: BouncerBounds,
  tx: number,
  tz: number,
  power = 1
) {
  const dx = tx - state.x;
  const dz = tz - state.z;
  const dist = Math.hypot(dx, dz);
  if (dist < 0.05) return;

  const jump =
    (bounds.jumpMin + Math.random() * (bounds.jumpMax - bounds.jumpMin)) *
    power;
  const duration = 0.55 + jump * 0.18;
  state.vx = dx / duration;
  state.vz = dz / duration;
  state.vy = jump * 3.2;
  state.grounded = false;
  state.walking = false;
  state.wait = 0;
  state.hopPhase = 0;
  state.targetX = tx;
  state.targetZ = tz;
  state.facing = dx >= 0 ? 1 : -1;
}

export function startWalking(
  state: BouncerState,
  bounds: BouncerBounds,
  tx?: number,
  tz?: number
) {
  const target =
    tx !== undefined && tz !== undefined
      ? { x: tx, z: tz }
      : pickWalkTarget(state, bounds);

  state.walking = true;
  state.grounded = true;
  state.wait = 0;
  state.vy = 0;
  state.y = bounds.floorY;
  state.targetX = target.x;
  state.targetZ = target.z;
  state.facing = target.x >= state.x ? 1 : -1;
}

export function stepMouseFollow(
  state: BouncerState,
  bounds: BouncerBounds,
  mouse: MouseFollowState,
  dt: number,
  time: number
): boolean {
  if (!mouse.active) return false;

  mouse.smoothX = smoothDamp(mouse.smoothX, mouse.targetX, dt, 0.1);
  mouse.smoothZ = smoothDamp(mouse.smoothZ, mouse.targetZ, dt, 0.1);

  const dx = mouse.smoothX - state.x;
  const dz = mouse.smoothZ - state.z;
  const dist = Math.hypot(dx, dz);
  const moving = dist > 0.025;

  state.grounded = true;
  state.vy = 0;
  state.walking = moving;

  if (moving) {
    state.walkPhase += dt * 12;
    const speed = Math.min(dist * 7.5, 3.2);
    state.x += (dx / dist) * speed * dt;
    state.z += (dz / dist) * speed * dt;
    state.vx = dx;
    state.vz = dz;
    state.facing = dx >= 0 ? 1 : -1;
    state.squash = smoothDamp(
      state.squash,
      Math.sin(state.walkPhase * 2) * 0.045,
      dt,
      0.1
    );
    state.y =
      bounds.floorY + Math.abs(Math.sin(state.walkPhase * 2)) * 0.035;
  } else {
    state.vx = smoothDamp(state.vx, 0, dt, 0.12);
    state.vz = smoothDamp(state.vz, 0, dt, 0.12);
    state.walkPhase += dt * 2.5;
    state.squash = smoothDamp(
      state.squash,
      Math.sin(time * 2.2) * 0.025,
      dt,
      0.14
    );
    state.y = bounds.floorY + Math.sin(time * 2.2) * 0.018;
  }

  state.x = clamp(state.x, bounds.minX, bounds.maxX);
  state.z = clamp(state.z, bounds.minZ, bounds.maxZ);
  return true;
}

export function stepMascotBouncer(
  state: BouncerState,
  bounds: BouncerBounds,
  dt: number,
  reducedMotion: boolean
) {
  const gravity = 11.5;
  const walkSpeed = 1.85;

  if (reducedMotion) {
    state.y = bounds.floorY;
    state.vy = 0;
    state.grounded = true;
    state.walking = false;
    state.squash = 0;
    return;
  }

  if (state.walking && state.grounded) {
    state.walkPhase += dt * 10;
    state.squash = smoothDamp(
      state.squash,
      Math.sin(state.walkPhase * 2) * 0.04,
      dt,
      0.1
    );

    const dx = state.targetX - state.x;
    const dz = state.targetZ - state.z;
    const dist = Math.hypot(dx, dz);

    if (dist < 0.08) {
      state.walking = false;
      state.wait = 0.4 + Math.random() * 1.1;
      state.vx = 0;
      state.vz = 0;
      return;
    }

    const step = walkSpeed * dt;
    state.x += (dx / dist) * step;
    state.z += (dz / dist) * step;
    state.facing = dx >= 0 ? 1 : -1;
    return;
  }

  if (state.grounded) {
    state.wait -= dt;
    state.squash = smoothDamp(state.squash, 0, dt, 0.12);
    state.vx *= 0.82;
    state.vz *= 0.82;

    if (state.wait <= 0) {
      const roll = Math.random();
      if (roll < 0.55) {
        startWalking(state, bounds);
      } else if (roll < 0.82) {
        const target = pickWalkTarget(state, bounds);
        startWalking(state, bounds, target.x, target.z);
      } else {
        const target = pickHopTarget(bounds);
        launchMascotToward(state, bounds, target.x, target.z);
      }
    }
  } else {
    state.hopPhase += dt;
    state.vy -= gravity * dt;
    state.y += state.vy * dt;
    state.x += state.vx * dt;
    state.z += state.vz * dt;

    if (state.vy > 0.4) {
      state.squash = smoothDamp(state.squash, -0.12, dt, 0.08);
    }

    if (state.y <= bounds.floorY) {
      state.y = bounds.floorY;
      state.vy = 0;
      state.vx *= 0.35;
      state.vz *= 0.35;
      state.grounded = true;
      state.wait = 0.35 + Math.random() * 0.9;
      state.squash = 0.24;
      state.hopPhase = 0;
    }
  }

  state.x = clamp(state.x, bounds.minX, bounds.maxX);
  state.z = clamp(state.z, bounds.minZ, bounds.maxZ);
}

export function mapPointerToFloor(
  nx: number,
  ny: number,
  bounds: BouncerBounds
) {
  const marginX = 0.35;
  return {
    x: bounds.minX + marginX + nx * (bounds.maxX - bounds.minX - marginX * 2),
    z:
      bounds.minZ +
      0.15 +
      (1 - ny) * (bounds.maxZ - bounds.minZ - 0.3),
  };
}

function smoothDamp(
  current: number,
  target: number,
  dt: number,
  smoothTime: number
) {
  const t = 1 - Math.exp(-dt / Math.max(smoothTime, 0.001));
  return current + (target - current) * t;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function boundsForAspect(aspect: number): BouncerBounds {
  const span = 1.55 + Math.max(0, aspect - 1.2) * 1.1;
  return {
    minX: -span,
    maxX: span,
    minZ: -0.55,
    maxZ: 0.55,
    floorY: -0.55,
    jumpMin: 0.45,
    jumpMax: 0.95,
  };
}
