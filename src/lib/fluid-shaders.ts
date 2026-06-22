/** Shared fullscreen pass vertex shader */
export const fluidVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const splatShader = `
  precision highp float;

  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float uAspect;
  uniform vec3 uPoint;
  uniform vec3 uColor;
  uniform float uRadius;

  void main() {
    vec2 p = vUv - uPoint.xy;
    p.x *= uAspect;
    vec3 splat = exp(-dot(p, p) / uRadius) * uColor;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

export const advectShader = `
  precision highp float;

  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 uTexelSize;
  uniform float uDissipation;
  uniform float uDt;

  void main() {
    vec2 coord = vUv - uDt * texture2D(uVelocity, vUv).xy * uTexelSize;
    gl_FragColor = uDissipation * texture2D(uSource, coord);
  }
`;

export const divergenceShader = `
  precision highp float;

  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;

  void main() {
    float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
    float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
    float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

export const pressureShader = `
  precision highp float;

  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  uniform vec2 uTexelSize;

  void main() {
    float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
    float C = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - C) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

export const gradientSubtractShader = `
  precision highp float;

  varying vec2 vUv;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;

  void main() {
    float L = texture2D(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
    float T = texture2D(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
    float B = texture2D(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

export const curlShader = `
  precision highp float;

  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform vec2 uTexelSize;

  void main() {
    float L = texture2D(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
    float R = texture2D(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
    float T = texture2D(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
    float B = texture2D(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

export const vorticityShader = `
  precision highp float;

  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform vec2 uTexelSize;
  uniform float uCurlStrength;
  uniform float uDt;

  void main() {
    float L = texture2D(uCurl, vUv - vec2(uTexelSize.x, 0.0)).x;
    float R = texture2D(uCurl, vUv + vec2(uTexelSize.x, 0.0)).x;
    float T = texture2D(uCurl, vUv + vec2(0.0, uTexelSize.y)).x;
    float B = texture2D(uCurl, vUv - vec2(0.0, uTexelSize.y)).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= uCurlStrength * C;
    force.y *= -1.0;

    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * uDt;
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

export const displayShader = `
  precision highp float;

  varying vec2 vUv;
  uniform sampler2D uDye;
  uniform sampler2D uVelocity;
  uniform float uTime;

  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  void main() {
    float t = uTime;

    vec2 restFlow = vec2(
      sin(t * 0.28 + vUv.y * 4.2),
      cos(t * 0.24 + vUv.x * 4.2)
    ) * 0.012;

    vec2 vel = texture2D(uVelocity, vUv).xy;
    float dye = texture2D(uDye, vUv).r;

    vec2 flow = vec2(
      noise(vUv * 1.4 + vec2(t * 0.32, t * 0.24)),
      noise(vUv * 1.4 + vec2(-t * 0.28, t * 0.36) + 4.1)
    ) - 0.5;
    vel += flow * 0.009 + restFlow;

    vec2 disp = vel * 42.0;
    vec2 uvA = vUv + disp * 0.009 + restFlow * 0.6;
    vec2 uvB = vUv + disp * 0.014 + vec2(noise(vUv + t * 0.5), noise(vUv - t * 0.4)) * 0.018;

    float n1 = noise(uvA * 2.8 + t * 0.14);
    float n2 = noise(uvB * 5.4 - t * 0.12);
    float n3 = noise(uvA * 1.2 + uvB * 0.45);

    // Site palette — warm paper stock
    vec3 paperSurface = vec3(0.980, 0.973, 0.957); // #faf8f4
    vec3 paperWarm    = vec3(0.941, 0.925, 0.902); // #f0ece4
    vec3 paperBg      = vec3(0.910, 0.894, 0.863); // #e8e4dc
    vec3 paperDeep    = vec3(0.871, 0.855, 0.824); // #dedad0
    vec3 textDim      = vec3(0.541, 0.522, 0.471); // #8a8578
    vec3 textSec      = vec3(0.290, 0.278, 0.251); // #4a4740
    vec3 accentGold   = vec3(0.945, 0.896, 0.0);   // #f1e500
    vec3 coralSoft    = vec3(0.835, 0.333, 0.349); // #d55559

    // Match paper-base radial highlight (warm top glow)
    float topGlow = smoothstep(0.0, 0.72, 1.0 - vUv.y);
    float cornerShade = smoothstep(0.3, 1.0, length(vUv - vec2(1.0, 1.0))) * 0.12;

    vec3 base = mix(paperBg, paperWarm, topGlow * 0.62);
    base = mix(base, paperSurface, topGlow * 0.18);
    base = mix(base, paperDeep, cornerShade + n2 * 0.07 + n3 * 0.04);
    base = mix(base, paperWarm, n1 * 0.06);

    // Watercolor wash — taupe, never muddy black
    float wash = clamp(dye, 0.0, 1.0);
    vec3 washTone = mix(textDim, textSec, smoothstep(0.35, 0.9, wash));
    base = mix(base, washTone, wash * 0.16);

    // Trace editorial accents in motion only
    float energy = length(vel);
    base += accentGold * energy * wash * 0.028;
    base = mix(base, coralSoft, wash * smoothstep(0.4, 0.75, dye) * 0.035);

    // Paper grain — subtle multiply feel
    float grain = hash(vUv * 360.0 + t * 0.35);
    base += vec3(grain - 0.5) * 0.009;

    gl_FragColor = vec4(base, 1.0);
  }
`;
