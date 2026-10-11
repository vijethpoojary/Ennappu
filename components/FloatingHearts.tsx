"use client";

import { useEffect, useState } from "react";
import { HEART_PATH } from "@/lib/heart";
import { isMobileDevice, pick, prefersReducedMotion, rand } from "@/lib/utils";

type Kind = "heart" | "petal" | "sparkle";
type Item = {
  id: number;
  kind: Kind;
  left: number;
  top: number;
  size: number;
  dur: number;
  delay: number;
  drift: number;
  opacity: number;
  color: string;
};

const HEART_COLORS = ["#ff8fab", "#ff6b9d", "#ffc9da", "#d6bcfa", "#f9a8d4"];
const PETAL_COLORS = ["#ffb3c8", "#ff8fab", "#fda4af", "#fecdd3"];
const SPARKLE_COLORS = ["#e9c46a", "#ffffff", "#f6dc9a", "#ffc9da"];

/** Ambient floating hearts, drifting rose petals and twinkling sparkles (pure CSS transforms). */
export default function FloatingHearts() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const mobile = isMobileDevice();
    const total = reduced ? 10 : mobile ? 16 : 30;
    const next: Item[] = Array.from({ length: total }, (_, id) => {
      const r = Math.random();
      const kind: Kind = reduced ? "sparkle" : r < 0.45 ? "heart" : r < 0.75 ? "petal" : "sparkle";
      return {
        id,
        kind,
        left: rand(0, 100),
        top: rand(5, 95),
        size: kind === "sparkle" ? rand(8, 16) : rand(12, mobile ? 26 : 34),
        dur: kind === "sparkle" ? rand(3, 6) : rand(14, 28),
        delay: -rand(0, 28),
        drift: rand(-80, 80),
        opacity: kind === "sparkle" ? rand(0.5, 0.9) : rand(0.25, 0.6),
        color: pick(kind === "heart" ? HEART_COLORS : kind === "petal" ? PETAL_COLORS : SPARKLE_COLORS),
      };
    });
    setItems(next);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {items.map((it) => (
        <span
          key={it.id}
          className={`amb amb-${it.kind}`}
          style={
            {
              left: `${it.left}%`,
              top: it.kind === "sparkle" ? `${it.top}%` : undefined,
              width: it.size,
              height: it.size,
              animationDuration: `${it.dur}s`,
              animationDelay: `${it.delay}s`,
              "--drift": `${it.drift}px`,
              "--o": it.opacity,
            } as React.CSSProperties
          }
        >
          <Shape kind={it.kind} color={it.color} />
        </span>
      ))}
    </div>
  );
}

function Shape({ kind, color }: { kind: Kind; color: string }) {
  if (kind === "heart")
    return (
      <svg viewBox="0 0 100 90" className="h-full w-full">
        <path d={HEART_PATH} fill={color} />
      </svg>
    );
  if (kind === "petal")
    return (
      <svg viewBox="0 0 24 24" className="h-full w-full">
        <path d="M12 2 C 19 6 21 14 12 22 C 3 14 5 6 12 2 Z" fill={color} />
        <path d="M12 4 C 13 10 13 15 12 20" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" fill="none" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className="h-full w-full">
      <path d="M12 0 C 13 8 16 11 24 12 C 16 13 13 16 12 24 C 11 16 8 13 0 12 C 8 11 11 8 12 0 Z" fill={color} />
    </svg>
  );
}
