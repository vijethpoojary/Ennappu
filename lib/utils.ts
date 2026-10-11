export const rand = (min: number, max: number) => min + Math.random() * (max - min);

export const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Split into user-perceived characters so emoji aren't cut in half by the typewriter. */
export function graphemes(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}
