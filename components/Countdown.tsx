"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { sections, together } from "@/data/content";
import { SectionHeading } from "./ui/SectionHeading";

const START = new Date(together.date).getTime();

function split(ms: number) {
  const s = Math.floor(Math.abs(ms) / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const t = now === null ? null : split(now - START);
  const dateLabel = new Date(together.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const units = [
    { label: "Days", value: t?.days, pad: 2 },
    { label: "Hours", value: t?.hours, pad: 2 },
    { label: "Minutes", value: t?.minutes, pad: 2 },
    { label: "Seconds", value: t?.seconds, pad: 2 },
  ];

  return (
    <section id="together" className="relative px-4 py-24 md:py-32">
      <SectionHeading {...sections.countdown} />

      <motion.div
        className="glass mx-auto max-w-5xl rounded-[2rem] px-4 py-8 sm:px-8 md:py-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid grid-cols-2 gap-x-2 gap-y-8 sm:grid-cols-4 sm:gap-4" role="timer" aria-live="off">
          {units.map((u) => (
            <div key={u.label} className="flex flex-col items-center">
              <div className="flex gap-1 md:gap-1.5">
                {(u.value === undefined ? "--" : String(u.value).padStart(u.pad, "0")).split("").map((d, i, arr) => (
                  <Digit key={arr.length - i} d={d} />
                ))}
              </div>
              <span className="mt-3 text-xs font-medium uppercase tracking-[0.3em] text-wine/60">{u.label}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center font-serif italic text-wine/70 md:text-lg">
          {dateLabel} · {together.footnote}
        </p>
      </motion.div>
    </section>
  );
}

function Digit({ d }: { d: string }) {
  return (
    <span className="relative inline-block h-14 w-9 overflow-hidden rounded-xl bg-gradient-to-b from-white to-blush-100 shadow-[0_8px_20px_-8px_rgba(225,29,116,0.4),inset_0_-2px_0_rgba(255,143,171,0.3)] [perspective:400px] sm:h-16 sm:w-11 md:h-24 md:w-16">
      <AnimatePresence initial={false}>
        <motion.span
          key={d}
          className="backface-hidden absolute inset-0 flex items-center justify-center font-serif text-3xl font-bold text-petal sm:text-4xl md:text-6xl"
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {d}
        </motion.span>
      </AnimatePresence>
      <span className="absolute inset-x-0 top-1/2 h-px bg-petal/15" aria-hidden />
    </span>
  );
}
