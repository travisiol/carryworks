"use client";

import { useEffect, useRef } from "react";
// Type-only: erased at compile time, so the runtime import below stays dynamic.
import type * as ThreeTypes from "three";

/**
 * The hero object: a machined chrome ring — the works — with a drop of glass
 * suspended in it — the carry. Both are lit by an environment that is painted
 * into a canvas at runtime, so the reflections are real without a single
 * asset being downloaded.
 *
 * three is imported dynamically inside the effect: the page stays server
 * rendered and the 3.5k lines of renderer never reach a visitor who bounces
 * before it paints.
 */
export function Hero3D({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let disposed = false;
    let frame = 0;
    let teardown = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed || !el) return;

      const width = el.clientWidth || 480;
      const height = el.clientHeight || 480;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return; // No WebGL: the CSS ring underneath is the whole hero.
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height, false);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.98;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(0, 0.2, 6.4);

      /* The environment, painted rather than loaded: a dark sky with a violet
         sun low-left and a cyan one high-right. Everything chrome in the scene
         is reflecting this. */
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const sky = ctx.createLinearGradient(0, 0, 0, 256);
        sky.addColorStop(0, "#0b0b18");
        sky.addColorStop(0.5, "#191932");
        sky.addColorStop(1, "#05050a");
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, 512, 256);

        const blob = (x: number, y: number, r: number, colour: string) => {
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, colour);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, 512, 256);
        };
        blob(120, 170, 150, "rgba(124,92,255,0.95)");
        blob(390, 70, 130, "rgba(52,230,255,0.85)");
        blob(300, 220, 90, "rgba(255,255,255,0.35)");
      }
      const envTexture = new THREE.CanvasTexture(canvas);
      envTexture.mapping = THREE.EquirectangularReflectionMapping;
      envTexture.colorSpace = THREE.SRGBColorSpace;
      scene.environment = envTexture;

      const group = new THREE.Group();
      scene.add(group);

      // The works: brushed chrome, catching both suns.
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.55, 0.4, 64, 180),
        new THREE.MeshPhysicalMaterial({
          color: 0xd7dbf2,
          metalness: 1,
          roughness: 0.14,
          clearcoat: 1,
          clearcoatRoughness: 0.1,
          envMapIntensity: 1.7,
        }),
      );
      ring.rotation.x = 1.16;
      group.add(ring);

      // The carry: a bead of glass that refracts whatever is behind it.
      const bead = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.62, 6),
        new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          metalness: 0,
          roughness: 0.06,
          transmission: 1,
          thickness: 1.6,
          ior: 1.55,
          /* Tinted attenuation rather than a clear bead: without it the glass
             blows out to a flat white blob under the two suns. */
          attenuationColor: new THREE.Color(0x8fa8ff),
          attenuationDistance: 1.4,
          envMapIntensity: 1.25,
          clearcoat: 1,
        }),
      );
      group.add(bead);

      // A thin orbit, the only emissive thing in the scene.
      const orbit = new THREE.Mesh(
        new THREE.TorusGeometry(2.35, 0.008, 8, 220),
        new THREE.MeshBasicMaterial({
          color: 0x34e6ff,
          transparent: true,
          opacity: 0.55,
        }),
      );
      orbit.rotation.x = 1.35;
      orbit.rotation.z = 0.4;
      group.add(orbit);

      scene.add(new THREE.AmbientLight(0xffffff, 0.35));
      const violet = new THREE.PointLight(0x7c5cff, 90, 30, 2);
      violet.position.set(-4.5, 2.5, 4);
      scene.add(violet);
      const cyan = new THREE.PointLight(0x34e6ff, 60, 30, 2);
      cyan.position.set(4.5, -2, 3.5);
      scene.add(cyan);

      /* Pointer parallax, damped. The object leans towards the cursor without
         ever chasing it. */
      let targetX = 0;
      let targetY = 0;
      const onPointer = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        targetX = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
        targetY = ((e.clientY - r.top) / r.height - 0.5) * 0.35;
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const clock = new THREE.Clock();

      const tick = () => {
        frame = requestAnimationFrame(tick);
        const t = clock.getElapsedTime();
        if (!reduced.matches) {
          ring.rotation.z = t * 0.18;
          bead.rotation.y = t * 0.5;
          bead.rotation.x = t * 0.22;
          orbit.rotation.z = 0.4 - t * 0.1;
          bead.position.y = Math.sin(t * 0.8) * 0.09;
        }
        group.rotation.y += (targetX - group.rotation.y) * 0.05;
        group.rotation.x += (targetY - group.rotation.x) * 0.05;
        renderer.render(scene, camera);
      };
      tick();

      const observer = new ResizeObserver(() => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      });
      observer.observe(el);

      teardown = () => {
        observer.disconnect();
        window.removeEventListener("pointermove", onPointer);
        ring.geometry.dispose();
        bead.geometry.dispose();
        orbit.geometry.dispose();
        (ring.material as ThreeTypes.Material).dispose();
        (bead.material as ThreeTypes.Material).dispose();
        (orbit.material as ThreeTypes.Material).dispose();
        envTexture.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      teardown();
    };
  }, []);

  return <div ref={host} className={className} aria-hidden />;
}
