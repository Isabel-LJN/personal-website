export const liquidVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const liquidFragmentShader = `
  precision highp float;

  uniform sampler2D uTextMap;
  uniform sampler2D uDisplacementMap;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uDistortionScale;
  uniform float uAmbientStrength;

  varying vec2 vUv;

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

  vec2 ambientFlow(vec2 uv, float time) {
    float t = time * 0.35;
    float n1 = noise(uv * 2.8 + vec2(t * 0.12, t * 0.09));
    float n2 = noise(uv * 2.8 + vec2(-t * 0.1, t * 0.14) + 1.7);
    float n3 = noise(uv * 5.2 + vec2(t * 0.06, -t * 0.08) + 3.1);
    return vec2(n1 + n3 * 0.35 - 0.67, n2 + n3 * 0.35 - 0.67);
  }

  void main() {
    vec2 disp = texture2D(uDisplacementMap, vUv).rg;
    vec2 ambient = ambientFlow(vUv, uTime) * uAmbientStrength;
    vec2 offset = (disp + ambient) * uDistortionScale;

    vec2 uv = vUv + offset;
    uv = clamp(uv, 0.002, 0.998);

    vec4 color = texture2D(uTextMap, uv);

    float edge = smoothstep(0.0, 0.04, color.a);
    color.a *= edge;

    gl_FragColor = color;
  }
`;
