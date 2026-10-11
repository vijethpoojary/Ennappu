"use client";

import { useEffect } from "react";
import { particles } from "@/lib/particles";
import { prefersReducedMotion } from "@/lib/utils";

/** Heart cursor trail on desktop (fine pointer); heart tap-ripple on touch screens. */
export default function CursorTrail() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    let lastT = 0;
    let lastX = 0;
    let lastY = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - lastT < 30 || Math.hypot(e.clientX - lastX, e.clientY - lastY) < 14) return;
      lastT = now;
      lastX = e.clientX;
      lastY = e.clientY;
      particles.trail(e.clientX, e.clientY);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.pointerType === "pen") particles.ripple(e.clientX, e.clientY);
    };

    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return null;
}
