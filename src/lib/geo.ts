/** Convert geographic coordinates to a point on a sphere (Y-up, standard globe orientation). */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number
): { x: number; y: number; z: number } {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;

  return {
    x: -radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.sin(theta),
  };
}

/** Globe rotation (radians) to bring lat/lng to face the camera (+Z). Uses YX Euler order matching Three.js. */
export function globeRotationForCity(
  lat: number,
  lng: number
): { rotX: number; rotY: number } {
  const { x, y, z } = latLngToVector3(lat, lng, 1);
  const len = Math.hypot(x, y, z) || 1;
  const px = x / len;
  const py = y / len;
  const pz = z / len;

  const rotY = Math.atan2(-px, pz);
  const y1 = py;
  const z1 = -px * Math.sin(rotY) + pz * Math.cos(rotY);
  const rotX = Math.atan2(y1, z1);

  return { rotX, rotY };
}

/** Spherical interpolation helper for camera focus transitions. */
export function slerpAngles(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  t: number
): { lat: number; lng: number } {
  return {
    lat: from.lat + (to.lat - from.lat) * t,
    lng: from.lng + (to.lng - from.lng) * t,
  };
}

/** Great-circle arc points between two coordinates on a sphere. */
export function greatCircleArcPoints(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  radius: number,
  segments = 48
): { x: number; y: number; z: number }[] {
  const start = latLngToVector3(lat1, lng1, 1);
  const end = latLngToVector3(lat2, lng2, 1);

  const dot = Math.max(
    -1,
    Math.min(1, start.x * end.x + start.y * end.y + start.z * end.z)
  );
  const omega = Math.acos(dot);

  if (omega < 0.0001) {
    return [latLngToVector3(lat1, lng1, radius)];
  }

  const sinOmega = Math.sin(omega);
  const points: { x: number; y: number; z: number }[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const a = Math.sin((1 - t) * omega) / sinOmega;
    const b = Math.sin(t * omega) / sinOmega;
    const x = a * start.x + b * end.x;
    const y = a * start.y + b * end.y;
    const z = a * start.z + b * end.z;
    const len = Math.hypot(x, y, z) || 1;
    const lift = 1 + Math.sin(Math.PI * t) * 0.06;
    points.push({
      x: (x / len) * radius * lift,
      y: (y / len) * radius * lift,
      z: (z / len) * radius * lift,
    });
  }

  return points;
}
