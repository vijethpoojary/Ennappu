"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { intro, names } from "@/data/content";
import { loveConfetti, sideCannons } from "@/lib/confetti";
import { HEART_PATH } from "@/lib/heart";
import { useTimers } from "@/lib/hooks";
import { particles } from "@/lib/particles";
import { sfx, unlockAudio } from "@/lib/sound";
import { isMobileDevice, pick, rand, shuffle } from "@/lib/utils";

type Balloon = {
  id: number;
  x: number; // centre, % of viewport width
  top: number; // only used for reduced motion (static layout)
  w: number;
  color: string;
  shape: "heart" | "round";
  dur: number;
  delay: number;
  sway: number;
};

type Fx = { id: number; x: number; y: number; color: string; letter?: string };

const COLORS = ["#ff6b9d", "#ff8fab", "#f472b6", "#e11d74", "#c084fc", "#a78bfa", "#fb7185", "#fbbf24", "#f9a8d4", "#fda4af"];
const POP_EMOJIS = ["💖", "💕", "❤️", "✨", "💗"];

let uid = 0;

function makeBalloon(initial: boolean, mobile: boolean, lane?: number, lanes?: number): Balloon {
  const dur = mobile ? rand(8.5, 13) : rand(10, 15);
  const x = lane !== undefined && lanes ? 6 + ((lane + rand(0.15, 0.85)) / lanes) * 88 : rand(8, 92);
  return {
    id: ++uid,
    x,
    top: rand(22, 72),
    w: mobile ? rand(64, 86) : rand(86, 124),
    color: pick(COLORS),
    shape: Math.random() < 0.45 ? "heart" : "round",
    dur,
    delay: initial ? -rand(0, dur) : 0,
    sway: rand(2.6, 4.4),
  };
}

export default function BalloonPop({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion();
  const later = useTimers();
  const letters = useMemo(() => Array.from(names.her.toUpperCase()), []);
  const [mobile] = useState(isMobileDevice);
  const [balloons, setBalloons] = useState<Balloon[]>(() => {
    const n = mobile ? intro.balloonCount.mobile : intro.balloonCount.desktop;
    return shuffle(Array.from({ length: n }, (_, i) => makeBalloon(true, mobile, i, n)));
  });
  const [revealed, setRevealed] = useState(0);
  const [fx, setFx] = useState<Fx[]>([]);

  const revealedRef = useRef(0);
  const doneRef = useRef(false);
  const els = useRef(new Map<number, HTMLButtonElement>());
  const complete = revealed >= letters.length;

  const pop = (b: Balloon, el: HTMLElement, withLetter: boolean, quiet = false) => {
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height * 0.35;
    const visible = y > -50 && y < window.innerHeight + 50;

    if (visible) {
      if (!quiet) sfx.pop();
      loveConfetti(x, y, { particleCount: mobile ? 26 : 55, colors: [b.color, "#ffffff", "#ffc9da", "#e9c46a"] });
      particles.burst(x, y, { emojis: POP_EMOJIS, count: 22, speed: [120, 380], size: [14, 28] });
    }

    let letter: string | undefined;
    if (withLetter) {
      const i = revealedRef.current;
      letter = letters[i];
      revealedRef.current = i + 1;
      setRevealed(i + 1);
    }
    if (visible) {
      const id = ++uid;
      setFx((f) => [...f, { id, x, y, color: b.color, letter }]);
      later(() => setFx((f) => f.filter((e) => e.id !== id)), 1300);
    }
    setBalloons((bs) => bs.filter((o) => o.id !== b.id));
  };

  const finale = () => {
    doneRef.current = true;
    later(() => {
      sideCannons(mobile ? 40 : 90);
      sfx.chime();
      const remaining = Array.from(els.current.entries());
      remaining.forEach(([id, el], i) => {
        later(() => {
          const b = balloonsRef.current.find((o) => o.id === id);
          if (b && el.isConnected) pop(b, el, false, i % 2 === 1);
        }, i * 90);
      });
      later(onComplete, remaining.length * 90 + 2200);
    }, 500);
  };

  const balloonsRef = useRef(balloons);
  balloonsRef.current = balloons;

  const handlePop = (b: Balloon, e: React.MouseEvent<HTMLButtonElement>) => {
    if (doneRef.current) return;
    unlockAudio();
    pop(b, e.currentTarget, true);
    if (revealedRef.current >= letters.length) finale();
    else later(() => !doneRef.current && setBalloons((bs) => [...bs, makeBalloon(false, mobile)]), 700);
  };

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_top,#ffe4ec_0%,#fff8f0_45%,#e9d8ff_100%)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* shared balloon shading */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <radialGradient id="balloon-shade" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="0.22" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="0.65" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.28" />
          </radialGradient>
        </defs>
      </svg>

      {/* soft sun glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[60vmin] w-[60vmin] -translate-x-1/2 rounded-full bg-blush-300/30 blur-3xl" aria-hidden />

      {/* balloons */}
      {balloons.map((b) => (
        <button
          key={b.id}
          type="button"
          aria-label="Pop a balloon"
          ref={(el) => {
            if (el) els.current.set(b.id, el);
            else els.current.delete(b.id);
          }}
          onClick={(e) => handlePop(b, e)}
          className={`absolute cursor-pointer touch-manipulation rounded-full outline-none focus-visible:ring-4 focus-visible:ring-white/80 ${reduced ? "" : "balloon-rise bottom-0"}`}
          style={
            reduced
              ? { left: `calc(${b.x}% - ${b.w / 2}px)`, top: `${b.top}%`, width: b.w }
              : { left: `calc(${b.x}% - ${b.w / 2}px)`, width: b.w, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s` }
          }
        >
          <span className="balloon-sway block" style={{ animationDuration: `${b.sway}s` }}>
            <BalloonSvg shape={b.shape} color={b.color} />
          </span>
        </button>
      ))}

      {/* pop effects */}
      <AnimatePresence>
        {fx.map((f) => (
          <div key={f.id} className="pointer-events-none fixed" style={{ left: f.x, top: f.y }} aria-hidden>
            <motion.span
              className="absolute -left-12 -top-12 h-24 w-24 rounded-full border-4"
              style={{ borderColor: f.color }}
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
            {f.letter && (
              <motion.span
                className="absolute -left-10 -top-12 flex h-24 w-20 items-center justify-center font-serif text-6xl font-bold text-white glow-text md:text-7xl"
                initial={{ scale: 0, y: 0, opacity: 1 }}
                animate={{ scale: [0, 1.5, 1.1], y: -80, opacity: [1, 1, 0] }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              >
                {f.letter}
              </motion.span>
            )}
          </div>
        ))}
      </AnimatePresence>

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col items-center px-4 pt-[max(1.5rem,env(safe-area-inset-top))] md:pt-10">
        <motion.h2
          className="glass rounded-full px-5 py-2.5 text-center font-serif text-lg font-semibold text-wine md:px-8 md:py-3 md:text-2xl"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 140 }}
        >
          {intro.balloonPrompt}
        </motion.h2>

        <div className="mt-4 flex gap-1.5 md:mt-6 md:gap-3" aria-live="polite" aria-label={`${revealed} of ${letters.length} letters found`}>
          {letters.map((l, i) => (
            <span
              key={i}
              className={`glass flex h-11 w-9 items-center justify-center rounded-xl md:h-16 md:w-14 md:rounded-2xl ${complete ? "shadow-[0_0_25px_rgba(255,107,157,0.7)]" : ""}`}
            >
              <AnimatePresence>
                {i < revealed && (
                  <motion.span
                    className="text-gradient font-serif text-2xl font-bold md:text-4xl"
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                  >
                    {l}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {complete ? (
            <motion.p
              key="done"
              className="mt-4 font-script text-5xl text-petal glow-text md:text-7xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
            >
              {names.her} 💖
            </motion.p>
          ) : (
            <motion.p key="hint" className="mt-3 text-sm text-wine/60 md:text-base" exit={{ opacity: 0 }}>
              {intro.balloonHint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function BalloonSvg({ shape, color }: { shape: Balloon["shape"]; color: string }) {
  return (
    <svg viewBox="0 0 100 150" className="block h-auto w-full drop-shadow-[0_8px_12px_rgba(90,26,63,0.18)]" aria-hidden>
      {shape === "round" ? (
        <>
          <ellipse cx="50" cy="52" rx="44" ry="50" fill={color} />
          <ellipse cx="50" cy="52" rx="44" ry="50" fill="url(#balloon-shade)" />
          <path d="M50 100 l-6 9 h12 z" fill={color} />
          <path d="M50 109 C 43 120, 57 132, 48 150" stroke="rgba(120,60,90,0.45)" strokeWidth="1.5" fill="none" />
        </>
      ) : (
        <>
          <g transform="translate(2 6) scale(0.96)">
            <path d={HEART_PATH} fill={color} />
            <path d={HEART_PATH} fill="url(#balloon-shade)" />
          </g>
          <path d="M50 89 l-6 9 h12 z" fill={color} />
          <path d="M50 98 C 43 112, 57 128, 48 150" stroke="rgba(120,60,90,0.45)" strokeWidth="1.5" fill="none" />
        </>
      )}
      <ellipse cx="32" cy="30" rx="7" ry="11" fill="#fff" opacity="0.5" transform="rotate(25 32 30)" />
    </svg>
  );
}
