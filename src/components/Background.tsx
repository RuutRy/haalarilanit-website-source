import { Suspense, lazy, useEffect, useRef } from "react";

// Fixed wallpaper + scrim + particle mesh backdrop.
const ParticleField = lazy(() => import("./ParticleField"));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const WALL_DRIFT = 50;
const MESH_DRIFT = 150;
const RANGE = 2000;

const WALL_MOUSE_FORCE = 10;

export function Background() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const root = rootRef.current;
    if (!root) return;
    const wall = root.querySelector<HTMLElement>(".bg-wall");
    let mesh = root.querySelector<HTMLElement>(".mesh-parallax");

    let tx = 0;
    let ty = 0; // cursor, normalized -1..1 from viewport center
    let cx = 0;
    let cy = 0; // eased cursor offset, in px

    const tick = () => {
      cx += (tx * WALL_MOUSE_FORCE - cx) * 0.12;
      cy += (ty * WALL_MOUSE_FORCE - cy) * 0.12;

      if (!mesh) mesh = root.querySelector(".mesh-parallax");

      const p = Math.min(window.scrollY / RANGE, 1);
      if (wall) wall.style.transform = `translate3d(${-cx}px, ${WALL_DRIFT * p - cy}px, 0)`;
      if (mesh) mesh.style.transform = `translate3d(0, ${MESH_DRIFT * p}px, 0)`;

      requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    const raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="fixed inset-0 -z-10 bg-ink">
      <div
        className="bg-wall absolute inset-0"
        style={{
          backgroundImage: "url(/assets/theme-bg.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "max(100vw, 1754px) auto",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-ink) 42%, transparent) 0%, color-mix(in srgb, var(--color-ink) 66%, transparent) 100%)",
        }}
      />
      {!prefersReducedMotion && (
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      )}
    </div>
  );
}
