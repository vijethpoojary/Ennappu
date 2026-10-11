"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { hero } from "@/data/content";
import { useTypewriter } from "@/lib/hooks";
import { Heart } from "./ui/Heart";

type Props = { start: boolean; onReplay: () => void };

export default function Hero({ start, onReplay }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBack = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 220]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -120]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 140]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const typed = useTypewriter(hero.headline, start);

  return (
    <section id="home" ref={ref} className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 pb-28 pt-24">
      {/* parallax glows */}
      <motion.div style={{ y: yBack }} className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blush-300/50 blur-3xl md:h-96 md:w-96" />
        <div className="absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-lavender-300/50 blur-3xl md:h-[28rem] md:w-[28rem]" />
      </motion.div>
      <motion.div style={{ y: yFront }} className="pointer-events-none absolute inset-0" aria-hidden>
        <Heart className="absolute left-[8%] top-[22%] h-10 w-10 text-petal/30 md:h-16 md:w-16" />
        <Heart className="absolute bottom-[22%] right-[10%] h-14 w-14 text-lavender-400/30 md:h-24 md:w-24" />
        <Heart className="absolute right-[22%] top-[14%] h-6 w-6 text-gold-400/50" />
        <div className="absolute bottom-[12%] left-1/2 h-40 w-[80%] -translate-x-1/2 rounded-full bg-gold-300/25 blur-3xl" />
      </motion.div>

      <motion.div style={{ y: yText, opacity: fade }} className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.p
          className="text-xs font-medium uppercase tracking-[0.4em] text-gold-500 md:text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={start ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          {hero.eyebrow}
        </motion.p>

        <h1 className="mt-5 font-script text-[clamp(3.2rem,12vw,8rem)] leading-[1.1] text-petal glow-text" aria-label={hero.headline}>
          <span className="relative inline-block" aria-hidden>
            <span className="invisible">{hero.headline}</span>
            <span className="absolute inset-0">
              {typed.text}
              {start && !typed.done && <span className="ml-1 inline-block animate-blink font-sans font-light text-petal/70">|</span>}
            </span>
          </span>
        </h1>

        <motion.p
          className="mt-6 font-serif text-lg italic text-wine/80 md:text-2xl"
          initial={{ opacity: 0, y: 14 }}
          animate={typed.done ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {hero.subtitle}
        </motion.p>

        <motion.button
          type="button"
          onClick={onReplay}
          className="glass mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 font-medium text-wine transition hover:scale-105 active:scale-95"
          initial={{ opacity: 0, y: 14 }}
          animate={typed.done ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {hero.replayLabel}
        </motion.button>
      </motion.div>

      <a href="#story" aria-label="Scroll to our story" className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 p-2 text-petal">
        <span className="text-[11px] uppercase tracking-[0.3em] text-wine/50">scroll</span>
        <motion.span
          animate={reduced ? {} : { y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="block"
        >
          <Heart className="h-7 w-7 animate-heartbeat drop-shadow-[0_0_10px_rgba(255,107,157,0.6)]" />
        </motion.span>
      </a>
    </section>
  );
}
