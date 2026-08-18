import type { IParticlesProps } from "@tsparticles/react";

import Particles, { ParticlesProvider } from "@tsparticles/react";
import { useMemo } from "react";
import { loadFull } from "tsparticles";

type Options = NonNullable<IParticlesProps["options"]>;

// Resolve theme colors once; canvas can't read CSS var() strings.
const cssColor = (name: string, fallback: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

const colorMilk = cssColor("--color-milk", "#decdd2");
const colorAccent = cssColor("--color-accent", "#c63f6a");

const initParticles = async (engine: Parameters<typeof loadFull>[0]) => {
  await loadFull(engine);
};

// Base config at module scope; only responsive fields change per render.
const options: Options = {
  fpsLimit: 60,
  detectRetina: false,
  pauseOnBlur: true,
  pauseOnOutsideViewport: true,
  particles: {
    number: { value: 45, density: { enable: true, width: 800, height: 800 } },
    color: { value: colorMilk },
    shape: { type: "circle" },
    opacity: {
      value: 0.5,
      animation: { enable: true, speed: 0.4, minimumValue: 0.15 },
    },
    size: { value: { min: 1, max: 3 } },
    move: {
      enable: true,
      speed: 0.05,
      direction: "none",
      outModes: { default: "out" },
    },
    links: {
      enable: true,
      distance: 110,
      color: colorAccent,
      opacity: 0.25,
      width: 1,
    },
  },
  interactivity: {
    events: { onHover: { enable: true, mode: ["grab", "parallax"] } },
    modes: {
      grab: { distance: 60, links: { opacity: 0.5 } },
      parallax: {
        enable: true,
        smooth: 20,
        force: 100,
      },
    },
  },
};

// Lazy-loaded so the ~500KB of tsParticles never blocks first paint.
// Everything particle-related (provider + engine + config) lives in
// this chunk on purpose. The container is over-sized vertically so the
// scroll parallax drift never exposes empty edges.
export default function ParticleField() {
  // Responsive tuning, computed once on mount: drop to 30fps on small
  // screens, and halve the canvas on >2x-DPR devices (detectRetina
  // stays on for 1x/2x so particles stay crisp, off above that).
  const responsiveOptions = useMemo<Options>(
    () => ({
      ...options,
      fpsLimit: window.innerWidth < 768 ? 30 : 60,
      detectRetina: window.devicePixelRatio <= 2,
    }),
    [],
  );

  return (
    <ParticlesProvider init={initParticles}>
      <Particles
        id="particle-field"
        options={responsiveOptions}
        className="mesh-parallax fixed inset-x-0 -top-56 -bottom-56 z-[1]"
      />
    </ParticlesProvider>
  );
}
