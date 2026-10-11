"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { nameBlast } from "@/data/content";
import { sideCannons } from "@/lib/confetti";
import { particles } from "@/lib/particles";
import { sfx } from "@/lib/sound";
import { shuffle } from "@/lib/utils";

/**
 * Shows the name in glowing script, then shatters every pixel of it into
 * floating hearts, hugs and kisses. Increment `playKey` to (re)play.
 */
export default function NameBlast({ playKey }: { playKey: number }) {
  const [visible, setVisible] = useState(false);
  const textRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!playKey) return;
    setVisible(true);
    const t = window.setTimeout(() => {
      const el = textRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const points = sampleText(el, 2200);
        particles.explode(points, { x: r.left + r.width / 2, y: r.top + r.height / 2 }, nameBlast.emojis);
        sfx.sparkle();
        sideCannons(50);
      }
      setVisible(false);
    }, reduced ? 1500 : 2000);
    return () => window.clearTimeout(t);
  }, [playKey, reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={playKey}
          className="pointer-events-none fixed inset-0 z-[85] flex items-center justify-center px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          aria-hidden
        >
          <motion.div
            className="absolute h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle,rgba(255,143,171,0.55),rgba(255,201,218,0.2)_45%,transparent_70%)] blur-2xl"
            initial={{ scale: 0.3 }}
            animate={{ scale: [0.3, 1.1, 1] }}
            transition={{ duration: 1.2 }}
          />
          <motion.h2
            ref={textRef}
            className="relative whitespace-nowrap font-script text-[clamp(5rem,26vw,15rem)] leading-none text-petal glow-text"
            initial={{ scale: 0.3, opacity: 0, filter: "blur(12px)" }}
            animate={{ scale: [0.3, 1.08, 1], opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 1.15, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          >
            {nameBlast.text}
          </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Rasterise the element's text and return viewport coordinates of filled pixels. */
function sampleText(el: HTMLElement, maxPoints: number) {
  const rect = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const padX = rect.width * 0.2;
  const padY = rect.height * 0.35;
  const w = Math.ceil(rect.width + padX * 2);
  const h = Math.ceil(rect.height + padY * 2);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx || w === 0 || h === 0) return [];

  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000";
  ctx.fillText(el.textContent ?? "", w / 2, h / 2);

  const data = ctx.getImageData(0, 0, w, h).data;
  const step = Math.max(2, Math.round(parseFloat(cs.fontSize) / 50));
  const pts: { x: number; y: number }[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 128) pts.push({ x: rect.left - padX + x, y: rect.top - padY + y });
    }
  }
  return shuffle(pts).slice(0, maxPoints);
}
