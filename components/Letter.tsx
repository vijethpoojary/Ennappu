"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { letter, sections } from "@/data/content";
import { HEART_PATH } from "@/lib/heart";
import { useTimers } from "@/lib/hooks";
import { particles } from "@/lib/particles";
import { sfx, unlockAudio } from "@/lib/sound";
import { SectionHeading } from "./ui/SectionHeading";

type Stage = "sealed" | "breaking" | "open";

// Slightly irregular wax blob outline (computed once).
const SEAL_PATH = (() => {
  const pts: string[] = [];
  const n = 30;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 45 + (i % 2 ? 2.2 : -0.8) + Math.sin(i * 1.7) * 1.4;
    pts.push(`${(50 + Math.cos(a) * r).toFixed(1)} ${(50 + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z`;
})();

export default function Letter() {
  const [stage, setStage] = useState<Stage>("sealed");
  const reduced = useReducedMotion();
  const later = useTimers();
  const sealRef = useRef<HTMLButtonElement>(null);

  const breakSeal = () => {
    if (stage !== "sealed") return;
    unlockAudio();
    sfx.pop();
    sfx.chime();
    setStage("breaking");
    const r = sealRef.current?.getBoundingClientRect();
    if (r) particles.burst(r.left + r.width / 2, r.top + r.height / 2, { emojis: ["💖", "✨", "💌", "🌹"], count: 40, speed: [150, 420] });
    later(() => setStage("open"), reduced ? 150 : 950);
  };

  const lineDelay = (i: number) => (reduced ? 0 : 1 + i * 0.45);

  return (
    <section id="letter" className="relative px-4 py-24 md:py-32">
      <SectionHeading {...sections.letter} />

      <div className="mx-auto max-w-2xl [perspective:1600px]">
        <AnimatePresence mode="wait">
          {stage !== "open" ? (
            <motion.div
              key="envelope"
              className="paper relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              exit={{ opacity: 0, y: 40, scale: 0.95, transition: { duration: 0.35 } }}
            >
              {/* envelope folds */}
              <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#f6e3d3] to-[#fbeee2] [clip-path:polygon(0_100%,50%_15%,100%_100%)]" aria-hidden />
              <div className="absolute inset-y-0 left-0 w-1/2 bg-[#f9e8da]/80 [clip-path:polygon(0_0,100%_55%,0_100%)]" aria-hidden />
              <div className="absolute inset-y-0 right-0 w-1/2 bg-[#f9e8da]/80 [clip-path:polygon(100%_0,0_55%,100%_100%)]" aria-hidden />
              <motion.div
                className="absolute inset-x-0 top-0 h-[58%] origin-top bg-gradient-to-b from-[#fff6ec] to-[#f3dcc8] shadow-[0_8px_16px_-8px_rgba(90,26,63,0.3)] [clip-path:polygon(0_0,100%_0,50%_100%)]"
                animate={stage === "breaking" ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: "easeInOut" }}
                aria-hidden
              />
              <p className="absolute inset-x-0 bottom-[10%] text-center font-hand text-2xl text-wine/70 md:text-3xl">{letter.envelopeLabel}</p>

              <button
                ref={sealRef}
                type="button"
                onClick={breakSeal}
                aria-label="Break the wax seal and open the letter"
                className="absolute left-1/2 top-[58%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-4 focus-visible:ring-petal/50 md:h-28 md:w-28"
              >
                <motion.span
                  className="absolute inset-0 [clip-path:inset(0_50%_0_0)]"
                  animate={stage === "breaking" ? { x: -50, y: 90, rotate: -50, opacity: 0 } : { scale: [1, 1.05, 1] }}
                  transition={stage === "breaking" ? { duration: 0.8, ease: "easeIn" } : { duration: 2, repeat: Infinity }}
                >
                  <WaxSeal />
                </motion.span>
                <motion.span
                  className="absolute inset-0 [clip-path:inset(0_0_0_50%)]"
                  animate={stage === "breaking" ? { x: 50, y: 90, rotate: 50, opacity: 0 } : { scale: [1, 1.05, 1] }}
                  transition={stage === "breaking" ? { duration: 0.8, ease: "easeIn" } : { duration: 2, repeat: Infinity }}
                >
                  <WaxSeal />
                </motion.span>
              </button>
              <motion.p
                className="absolute inset-x-0 top-[78%] text-center text-xs uppercase tracking-[0.25em] text-wine/50"
                animate={{ opacity: stage === "sealed" ? [0.4, 1, 0.4] : 0 }}
                transition={{ duration: 2, repeat: stage === "sealed" ? Infinity : 0 }}
              >
                {letter.sealHint}
              </motion.p>
            </motion.div>
          ) : (
            <motion.article
              key="letter"
              className="paper relative origin-top rounded-2xl px-6 py-10 sm:px-10 md:px-14 md:py-14"
              initial={{ rotateX: reduced ? 0 : -80, scaleY: reduced ? 1 : 0.35, opacity: 0 }}
              animate={{ rotateX: 0, scaleY: 1, opacity: 1 }}
              transition={{ duration: reduced ? 0.3 : 1.1, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {/* fold creases */}
              <span className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-wine/10 to-transparent" aria-hidden />
              <span className="pointer-events-none absolute inset-x-0 top-2/3 h-px bg-gradient-to-r from-transparent via-wine/10 to-transparent" aria-hidden />

              <div className="font-hand text-[1.45rem] leading-[40px] text-wine md:text-[1.7rem]">
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: lineDelay(0) - 0.3 }} className="mb-4 font-semibold">
                  {letter.greeting}
                </motion.p>
                {letter.lines.map((line, i) => (
                  <motion.p
                    key={i}
                    className="mb-4"
                    initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: lineDelay(i + 1), duration: 0.8 }}
                  >
                    {line}
                  </motion.p>
                ))}
                <motion.div
                  className="mt-8 text-right"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: lineDelay(letter.lines.length + 1) }}
                >
                  <p>{letter.closing}</p>
                  <p className="font-script text-5xl leading-tight text-petal md:text-6xl">{letter.signature}</p>
                </motion.div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <span className="h-14 w-14" aria-hidden>
                  <WaxSeal />
                </span>
                <button
                  type="button"
                  onClick={() => setStage("sealed")}
                  className="min-h-[44px] rounded-full px-4 text-sm text-wine/60 underline-offset-4 hover:text-wine hover:underline"
                >
                  Seal it again ✉️
                </button>
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

function WaxSeal() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full drop-shadow-[0_6px_10px_rgba(90,10,40,0.45)]" aria-hidden>
      <defs>
        <radialGradient id="wax" cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#e8457a" />
          <stop offset="0.55" stopColor="#be123c" />
          <stop offset="1" stopColor="#7f0b2e" />
        </radialGradient>
      </defs>
      <path d={SEAL_PATH} fill="url(#wax)" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#8a0f33" strokeWidth="2.5" opacity="0.6" />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#ff8fab" strokeWidth="0.8" opacity="0.35" transform="translate(-0.8 -0.8)" />
      <g transform="translate(29 31) scale(0.42)">
        <path d={HEART_PATH} fill="#9b1238" />
        <path d={HEART_PATH} fill="none" stroke="#ff8fab" strokeOpacity="0.45" strokeWidth="3" transform="translate(-1.5 -1.5)" />
      </g>
    </svg>
  );
}
