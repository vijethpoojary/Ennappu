"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";
import { intro } from "@/data/content";
import { loveConfetti } from "@/lib/confetti";
import { HEART_PATH } from "@/lib/heart";
import { useTimers } from "@/lib/hooks";
import { particles } from "@/lib/particles";
import { sfx, unlockAudio } from "@/lib/sound";

type Props = { onOpen: () => void; onDone: () => void };

const DOOR_EASE = [0.7, 0, 0.25, 1] as const;

export default function OpeningHeart({ onOpen, onDone }: Props) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const later = useTimers();

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (open) return;
    setOpen(true);
    unlockAudio();
    sfx.whoosh();
    sfx.chime();
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    later(() => {
      loveConfetti(cx, cy, { particleCount: 140, spread: 360, startVelocity: 38, scalar: 1.3, ticks: 220, gravity: 0.6 });
      particles.burst(cx, cy, { emojis: ["💖", "✨", "💕", "💗", "🌸"], count: 70, speed: [200, 650], size: [16, 34], gravity: 160, life: [1.4, 2.4] });
    }, 250);
    later(onOpen, 350);
    later(onDone, 1900);
  };

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* backdrop that dissolves to reveal the page behind */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#4a1d47_0%,#2a0f2a_55%,#170818_100%)]"
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 1.2, delay: open ? 0.45 : 0 }}
        aria-hidden
      />

      <motion.div
        className="relative w-[min(72vw,380px)]"
        animate={open ? { scale: 1.15 } : reduced ? { scale: 1 } : { scale: [1, 1.07, 1, 1.12, 1] }}
        transition={open ? { duration: 1 } : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* glow */}
        <motion.div
          className="absolute -inset-[30%] rounded-full bg-petal/45 blur-3xl"
          animate={{ opacity: open ? 0 : [0.6, 1, 0.6] }}
          transition={open ? { duration: 0.5 } : { duration: 1.4, repeat: Infinity }}
          aria-hidden
        />

        <button
          type="button"
          onClick={handleOpen}
          disabled={open}
          aria-label="Open the heart"
          className="relative block aspect-[100/90] w-full cursor-pointer rounded-[40%] outline-none [perspective:1400px] focus-visible:ring-4 focus-visible:ring-white/70"
        >
          {/* left door */}
          <motion.div
            className="absolute inset-y-0 left-0 w-1/2 overflow-hidden"
            style={{ transformOrigin: "left center" }}
            animate={open ? { rotateY: -115, opacity: 0 } : { rotateY: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: DOOR_EASE, opacity: { delay: 0.5, duration: 0.7 } }}
          >
            <HeartFace className="absolute inset-y-0 left-0 h-full w-[200%]" />
          </motion.div>
          {/* right door */}
          <motion.div
            className="absolute inset-y-0 right-0 w-1/2 overflow-hidden"
            style={{ transformOrigin: "right center" }}
            animate={open ? { rotateY: 115, opacity: 0 } : { rotateY: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: DOOR_EASE, opacity: { delay: 0.5, duration: 0.7 } }}
          >
            <HeartFace className="absolute inset-y-0 right-0 h-full w-[200%]" />
          </motion.div>

          {/* glowing seam */}
          <motion.span
            className="absolute bottom-[8%] left-1/2 top-[16%] w-[3px] -translate-x-1/2 rounded-full bg-white blur-[1px]"
            animate={{ opacity: open ? [1, 1, 0] : [0.25, 0.8, 0.25] }}
            transition={open ? { duration: 0.6 } : { duration: 1.4, repeat: Infinity }}
            aria-hidden
          />

          {/* light burst */}
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
            <motion.span
              className="block h-1/2 w-1/2 rounded-full bg-[radial-gradient(circle,#ffffff_0%,#ffe4ec_35%,rgba(255,143,171,0)_70%)]"
              initial={{ scale: 0, opacity: 0 }}
              animate={open ? { scale: [0, 2.5, 9], opacity: [0, 1, 0] } : { scale: 0, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </span>
        </button>
      </motion.div>

      <motion.p
        className="relative mt-12 px-6 text-center font-serif text-xl italic text-blush-100 glow-text-soft md:text-2xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: open ? 0 : 1, y: 0 }}
        transition={{ delay: open ? 0 : 0.6 }}
      >
        {intro.heartPrompt}
      </motion.p>
    </motion.div>
  );
}

function HeartFace({ className }: { className: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 90" className={className} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={`hf-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb3c8" />
          <stop offset="0.45" stopColor="#ff6b9d" />
          <stop offset="1" stopColor="#c2185b" />
        </linearGradient>
        <radialGradient id={`hs-${id}`} cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={HEART_PATH} fill={`url(#hf-${id})`} />
      <path d={HEART_PATH} fill={`url(#hs-${id})`} />
      <path d={HEART_PATH} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
      <ellipse cx="27" cy="24" rx="11" ry="6.5" fill="#fff" opacity="0.45" transform="rotate(-35 27 24)" />
      <circle cx="80" cy="22" r="2" fill="#fff" opacity="0.6" />
    </svg>
  );
}
