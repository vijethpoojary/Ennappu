import confetti from "canvas-confetti";
import { HEART_PATH } from "./heart";

export const LOVE_COLORS = ["#ff6b9d", "#ff8fab", "#ffc9da", "#e11d74", "#b794f4", "#e9c46a", "#ffffff"];

let heartShape: confetti.Shape | null = null;

function heart() {
  if (!heartShape) heartShape = confetti.shapeFromPath({ path: HEART_PATH });
  return heartShape;
}

/** Confetti + heart-shaped confetti, origin in viewport pixels. */
export function loveConfetti(x: number, y: number, opts: confetti.Options = {}) {
  if (typeof window === "undefined") return;
  void confetti({
    particleCount: 60,
    spread: 75,
    startVelocity: 28,
    ticks: 140,
    scalar: 0.9,
    colors: LOVE_COLORS,
    zIndex: 100,
    disableForReducedMotion: true,
    ...opts,
    shapes: [heart(), "circle", "square"],
    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
  });
}

/** Two side cannons, used for big celebratory moments. */
export function sideCannons(count = 80) {
  const base = { particleCount: count, spread: 65, startVelocity: 55, ticks: 220, colors: LOVE_COLORS, zIndex: 100, disableForReducedMotion: true };
  void confetti({ ...base, angle: 60, origin: { x: 0, y: 0.85 }, shapes: [heart(), "circle"] });
  void confetti({ ...base, angle: 120, origin: { x: 1, y: 0.85 }, shapes: [heart(), "circle"] });
}
