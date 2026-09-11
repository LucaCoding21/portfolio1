"use client";

import { useEffect, useRef } from "react";
import { reducedMotion } from "./motion";

/**
 * A live painted sky: two layers of drifting cloud over a soft gradient,
 * with a warm glow high on the right and a little grain so it reads as
 * paint rather than render. One fragment shader, no library. Draws at
 * half resolution, only while on screen, and holds a single frame when
 * the reader prefers reduced motion. Falls back to a CSS gradient if
 * WebGL isn't there.
 */

const VERT = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float ar = u_res.x / u_res.y;
  vec2 p = vec2(uv.x * ar, uv.y);
  float t = u_time * 0.018;

  // the sky: deeper blue up top, pale and a touch warm at the horizon
  vec3 top = vec3(0.50, 0.64, 0.86);
  vec3 hor = vec3(0.86, 0.89, 0.93);
  vec3 warm = vec3(0.97, 0.93, 0.86);
  vec3 sky = mix(hor, top, smoothstep(-0.25, 1.0, uv.y));
  sky = mix(sky, warm, 0.2 * pow(1.0 - uv.y, 2.0));

  // clouds: a slow warp so they turn over instead of just sliding
  vec2 q = vec2(fbm(p * 1.3 + t), fbm(p * 1.3 + vec2(5.2, 1.3) - t));
  float c1 = fbm(p * 1.9 + vec2(t * 3.0, 0.0) + q * 0.9);
  float c2 = fbm(p * 3.8 + vec2(t * 4.5, t * 0.6) + q * 0.5);
  float cov = smoothstep(0.40, 0.74, c1 * 0.72 + c2 * 0.36);
  vec3 shade = vec3(0.76, 0.81, 0.90);
  vec3 light = vec3(1.0, 0.99, 0.97);
  vec3 cloud = mix(shade, light, smoothstep(0.35, 0.85, c1 + 0.15 * c2));
  vec3 col = mix(sky, cloud, cov * 0.94);

  // a warm glow, high on the right, like late light
  float g = exp(-2.6 * length(p - vec2(ar * 0.80, 0.86)));
  col += vec3(1.0, 0.94, 0.84) * g * 0.22;

  // grain, so it reads as paint
  col += (hash(gl_FragCoord.xy + fract(u_time) * 7.0) - 0.5) * 0.022;

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function SkyCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");

    const still = reducedMotion();
    let raf = 0;
    let visible = false;
    let sized = false;
    const t0 = performance.now();

    const resize = () => {
      // half resolution: clouds don't need the pixels, phones need the battery
      const scale = 0.5 * Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      }
      sized = true;
    };

    const draw = (now: number) => {
      if (!sized) resize();
      // start a little way in so the first frame already has clouds
      gl.uniform1f(uTime, 40 + (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (raf || still) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // one frame straight away, so there's never a blank canvas
    resize();
    draw(performance.now());

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) {
          if (still) draw(performance.now());
          else start();
        } else stop();
      },
      { rootMargin: "10% 0px" }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (still && visible) draw(performance.now());
    });
    ro.observe(canvas);

    const onVis = () => (document.hidden ? stop() : visible && start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
      style={{ background: "linear-gradient(180deg, #7fa2db 0%, #dbe3ee 70%, #f4efe5 100%)" }}
    />
  );
}
