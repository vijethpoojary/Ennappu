"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { intro, names } from "@/data/content";
import { HEART_PATH } from "@/lib/heart";
import { unlockAudio } from "@/lib/sound";
import BalloonPop from "./BalloonPop";
import OpeningHeart from "./OpeningHeart";

type Phase = "loading" | "balloons" | "heart";

type Props = {
  /** Heart doors start opening: reveal the page and fire the name blast. */
  onReveal: () => void;
  /** Intro overlay finished animating out. */
  onFinish: () => void;
  onSkip: () => void;
};

export default function Intro({ onReveal, onFinish, onSkip }: Props) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [opened, setOpened] = useState(false);

  const toBalloons = useCallback(() => setPhase("balloons"), []);
  const toHeart = useCallback(() => setPhase("heart"), []);
  const handleOpen = useCallback(() => {
    setOpened(true);
    onReveal();
  }, [onReveal]);

  const skip = () => {
    unlockAudio();
    onSkip();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`A surprise for ${names.her}`}
      className={`fixed inset-0 z-[80] touch-none select-none overflow-hidden overscroll-none ${opened ? "pointer-events-none" : ""}`}
    >
      <AnimatePresence>
        {phase === "loading" && <Loader key="loader" onDone={toBalloons} />}
        {phase === "balloons" && <BalloonPop key="balloons" onComplete={toHeart} />}
        {phase === "heart" && <OpeningHeart key="heart" onOpen={handleOpen} onDone={onFinish} />}
      </AnimatePresence>

      {!opened && phase !== "loading" && (
        <motion.button
          type="button"
          onClick={skip}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="glass absolute bottom-5 right-4 z-20 min-h-[44px] rounded-full px-5 text-sm font-medium text-wine/80 transition hover:text-wine md:bottom-8 md:right-8"
        >
          {intro.skipLabel} →
        </motion.button>
      )}
    </div>
  );
}

/** Pulsing heart that fills up with pink "liquid", then fades away. */
function Loader({ onDone }: { onDone: () => void }) {
  const done = useRef(onDone);
  done.current = onDone;

  useEffect(() => {
    let cancelled = false;
    const minTime = new Promise((r) => setTimeout(r, 2700));
    const fonts = typeof document !== "undefined" && document.fonts ? document.fonts.ready : Promise.resolve();
    void Promise.all([minTime, fonts]).then(() => {
      if (!cancelled) done.current();
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Wave spans 200 units; shifting it by one period (50) loops seamlessly.
  const wave = "M0 6 Q12.5 0 25 6 T50 6 T75 6 T100 6 T125 6 T150 6 T175 6 T200 6 V120 H0 Z";

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blush-100 via-cream to-lavender-100"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.7 }}
    >
      <div className="relative">
        <div className="absolute inset-0 -m-8 rounded-full bg-petal/30 blur-3xl" aria-hidden />
        <svg viewBox="-4 -4 108 98" className="relative h-32 w-32 animate-heartbeat drop-shadow-[0_0_25px_rgba(255,107,157,0.55)] md:h-40 md:w-40" aria-hidden>
          <defs>
            <clipPath id="loader-clip">
              <path d={HEART_PATH} />
            </clipPath>
            <linearGradient id="loader-liquid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ff8fab" />
              <stop offset="1" stopColor="#e11d74" />
            </linearGradient>
          </defs>
          <path d={HEART_PATH} fill="rgba(255,255,255,0.55)" />
          <g clipPath="url(#loader-clip)">
            <motion.g initial={{ y: 92 }} animate={{ y: -8 }} transition={{ duration: 2.4, ease: "easeInOut" }}>
              <motion.path
                d={wave}
                fill="url(#loader-liquid)"
                animate={{ x: [0, -50] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
              />
            </motion.g>
            <ellipse cx="28" cy="26" rx="10" ry="6" fill="#fff" opacity="0.45" transform="rotate(-35 28 26)" />
          </g>
          <path d={HEART_PATH} fill="none" stroke="#ff6b9d" strokeWidth="2.5" />
        </svg>
      </div>
      <motion.p
        className="mt-10 px-6 text-center font-serif text-lg italic text-wine/75 md:text-xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {intro.loadingText}
      </motion.p>
    </motion.div>
  );
}
