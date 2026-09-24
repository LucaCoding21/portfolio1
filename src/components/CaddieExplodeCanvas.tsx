"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * The Caddie Companion exploded view, ported 1:1 from the client's own site
 * (caddie/components/CaddieExplodeCanvas.tsx) for the case study. Same model,
 * parts file, materials, lighting and per-part cascade. The scroll pin lives in
 * CaddieExplodedView, which writes 0 → 1 into `progress`; this only draws.
 *
 * Phone-friendly: a lower pixel ratio on small screens, no pointer tilt on
 * touch, and the render loop stops while the panel is off screen.
 *
 * Assets live in public/caddie/ (Draco-compressed GLB, explode.json, decoder).
 */

/** Per-material PBR look. Keys match the `mat` field baked into explode.json. */
const MATERIALS: Record<
  string,
  { color: number; metalness: number; roughness: number }
> = {
  Cad: { color: 0xc2cace, metalness: 0.92, roughness: 0.34 }, // bright steel screws/pivots
  d_1: { color: 0xc3ccd2, metalness: 0.88, roughness: 0.3 }, // satin steel tools
  d_2: { color: 0xc8d2db, metalness: 1.0, roughness: 0.18 }, // mirror knife blades
  d_3: { color: 0x837a70, metalness: 0.85, roughness: 0.45 }, // steel pivot pins
  d_4: { color: 0xb07a2e, metalness: 1.0, roughness: 0.36 }, // brass brush bristles
  d_5: { color: 0x67728d, metalness: 0.82, roughness: 0.4 }, // anodised hardware
  scale: { color: 0x16181b, metalness: 0.28, roughness: 0.54 }, // matte black anodised handle
  engrave: { color: 0xd2d6da, metalness: 0.35, roughness: 0.6 }, // light etched logo on black
};

type PartMeta = {
  mat: string;
  off: [number, number, number]; // explode target offset (metres, model space)
  start: number; // 0..1 scroll point this part begins travelling (cascade ripple)
  // Optional: deploy by rotating around a pivot instead of translating away.
  pivot?: [number, number, number];
  spin?: [number, number, number, number];
};

type ExplodeData = {
  parts: Record<string, PartMeta>;
};

const ASSETS = "/caddie";

export default function CaddieExplodeCanvas({
  progress,
  onReady,
}: {
  progress: RefObject<number>;
  onReady?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const container = containerRef.current!;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    // Cap the pixel ratio: retina DPR 2 to 3 renders 4 to 9x the pixels for
    // little visible gain. Phones get the lower cap; their GPUs are the weakest.
    const small = window.matchMedia("(max-width: 767px)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.25 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 100);
    camera.position.set(0, 0, 0.42);

    // Image-based lighting for believable metal reflections.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    // Key / fill / rim directional lights for crisp metal highlights.
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(0.4, 0.7, 0.8);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9fc4ff, 1.1);
    fill.position.set(-0.6, 0.1, 0.4);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffe7c2, 1.6);
    rim.position.set(0.0, -0.5, -0.8);
    scene.add(rim);
    scene.add(new THREE.HemisphereLight(0xcfe0ff, 0x14181f, 0.5));

    const root = new THREE.Group();
    scene.add(root);

    // Drives the explosion; updated by ScrollTrigger, eased toward in the loop.
    const target = { p: 0 };
    const current = { p: 0 };
    const pointer = { x: 0, y: 0 };

    let parts: {
      node: THREE.Object3D;
      off: THREE.Vector3;
      start: number;
      pivot?: THREE.Vector3;
      axis?: THREE.Vector3;
      angle?: number;
    }[] = [];
    const _q = new THREE.Quaternion();
    const _v = new THREE.Vector3();
    let fanMid = 0; // vertical center of the fully-exploded fan
    // Half-extents used to auto-fit the camera (assembled vs fully exploded).
    const frame = { hx: 0.07, hy: 0.02, exHx: 0.1, exHy: 0.16 };
    let disposed = false;

    // One shared material per material group, not one per mesh: hundreds of
    // unique materials mean hundreds of shader compiles on the first frame.
    const matCache: Record<string, THREE.MeshStandardMaterial> = {};
    const materialFor = (key: string) => {
      const k = MATERIALS[key] ? key : "Cad";
      if (!matCache[k]) {
        const look = MATERIALS[k];
        matCache[k] = new THREE.MeshStandardMaterial({
          color: look.color,
          metalness: look.metalness,
          roughness: look.roughness,
          envMapIntensity: 1.1,
          side: k === "engrave" ? THREE.DoubleSide : THREE.FrontSide,
        });
      }
      return matCache[k];
    };

    // Render on demand: only draw while something is actually changing.
    let dirty = true;
    const wake = () => {
      dirty = true;
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
      wake();
    };
    // Tilt follows the mouse only; touch screens have no hover to follow.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (finePointer) window.addEventListener("pointermove", onPointer);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      wake();
    };

    const smooth = (a: number, b: number, x: number) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    let drewModel = false;

    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(`${ASSETS}/draco/`);
    gltfLoader.setDRACOLoader(dracoLoader);

    Promise.all([
      gltfLoader.loadAsync(`${ASSETS}/caddie_exploded_engraved.glb`),
      fetch(`${ASSETS}/explode.json`).then((r) => r.json() as Promise<ExplodeData>),
    ]).then(([gltf, data]) => {
      if (disposed) return;

      gltf.scene.traverse((obj) => {
        const meta = data.parts[obj.name];
        if (!meta || !(obj as THREE.Mesh).isMesh) return;
        const mesh = obj as THREE.Mesh;
        mesh.material = materialFor(meta.mat);
        mesh.castShadow = false;
        const off = new THREE.Vector3(...meta.off);
        const entry: (typeof parts)[number] = { node: mesh, off, start: meta.start };
        if (meta.pivot && meta.spin) {
          entry.pivot = new THREE.Vector3(...meta.pivot);
          entry.axis = new THREE.Vector3(meta.spin[0], meta.spin[1], meta.spin[2]).normalize();
          entry.angle = meta.spin[3];
        }
        parts.push(entry);
      });

      root.add(gltf.scene);

      if (parts.length) {
        const ys = parts.map((p) => p.off.y);
        fanMid = (Math.min(...ys) + Math.max(...ys)) / 2;
      }

      // Frame the assembled model.
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      root.position.sub(center);

      const maxAbs = (a: number, b: number) => Math.max(Math.abs(a), Math.abs(b));
      const offX = parts.map((p) => p.off.x);
      const offY = parts.map((p) => p.off.y);
      frame.hx = size.x / 2;
      frame.hy = size.y / 2;
      frame.exHx = size.x / 2 + maxAbs(Math.min(...offX, 0), Math.max(...offX, 0));
      frame.exHy =
        size.y / 2 +
        (Math.max(...offY, 0) - Math.min(...offY, 0)) / 2 +
        maxAbs(fanMid, 0);

      drewModel = true;
      resize();
    });

    window.addEventListener("resize", resize);
    resize();

    const clock = new THREE.Clock();
    const loop = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      target.p = progress.current ?? 0;
      const moving = Math.abs(target.p - current.p) > 1e-4;
      if (!dirty && !moving) return; // idle: nothing to redraw
      current.p += (target.p - current.p) * Math.min(1, dt * 6);
      const p = current.p;

      for (const part of parts) {
        const { node, off, start } = part;
        const t = smooth(start, start + 0.6, p);
        if (part.angle && part.pivot && part.axis) {
          // Rotate around the pivot, then add any translation.
          _q.setFromAxisAngle(part.axis, part.angle * t);
          _v.copy(part.pivot).applyQuaternion(_q);
          node.quaternion.copy(_q);
          node.position.copy(part.pivot).sub(_v).addScaledVector(off, t);
        } else {
          node.position.set(off.x * t, off.y * t, off.z * t);
        }
      }

      // Rotate from a 3/4 reveal toward a clean broadside as it explodes.
      const spin = smooth(0, 0.55, p);
      root.rotation.y = (1 - spin) * 0.7 + pointer.x * 0.18 * (0.4 + p);
      root.rotation.x = -0.12 * (1 - spin) + pointer.y * 0.08;

      // Auto-fit the camera from the assembled tool to the full fan.
      const ex = smooth(0, 1, p);
      const midY = fanMid * ex;
      const halfTan = Math.tan((camera.fov * Math.PI) / 360);
      const W = frame.hx + (frame.exHx - frame.hx) * ex;
      const H = frame.hy + (frame.exHy - frame.hy) * ex;
      // A touch more room on tall (phone) panels so the brush clears the edge.
      const MARGIN = camera.aspect < 1 ? 1.55 : 1.32;
      const dist = Math.max(W / (halfTan * camera.aspect), H / halfTan) * MARGIN;
      camera.position.z = dist;
      camera.position.y = midY;
      camera.lookAt(0, midY, 0);

      renderer.render(scene, camera);
      dirty = false;
      if (drewModel && onReadyRef.current) {
        onReadyRef.current();
        onReadyRef.current = undefined;
      }
    };

    // Only run the loop while the panel is on screen.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        clock.getDelta();
        wake();
        renderer.setAnimationLoop(loop);
      } else {
        renderer.setAnimationLoop(null);
      }
    });
    io.observe(container);

    return () => {
      disposed = true;
      io.disconnect();
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      envTex.dispose();
      pmrem.dispose();
      Object.values(matCache).forEach((m) => m.dispose());
      dracoLoader.dispose();
      renderer.dispose();
      parts = [];
    };
  }, [progress]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
