"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { hugKiss } from "@/data/content";
import { particles } from "@/lib/particles";
import { sfx, unlockAudio } from "@/lib/sound";

export default function HugKiss() {
  const [hugs, setHugs] = useState(0);
  const [kisses, setKisses] = useState(0);

  const hug = () => {
    unlockAudio();
    sfx.hug();
    particles.rain(hugKiss.hugEmojis, { count: hugKiss.rainCount });
    setHugs((h) => h + 1);
  };
  const kiss = () => {
    unlockAudio();
    sfx.kiss();
    particles.rain(hugKiss.kissEmojis, { count: hugKiss.rainCount });
    setKisses((k) => k + 1);
  };

  return (
    <section id="hugs" className="relative px-4 py-24 md:py-32">
      <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2 md:gap-8">
        <ZoneButton emoji="🤗" label={hugKiss.hugLabel} count={hugs} unit="hug" onClick={hug} className="from-lavender-300 via-lavender-200 to-blush-200" />
        <ZoneButton emoji="💋" label={hugKiss.kissLabel} count={kisses} unit="kiss" onClick={kiss} className="from-petal via-blush-400 to-blush-200" />
      </div>
    </section>
  );
}

type ZoneProps = { emoji: string; label: string; count: number; unit: string; onClick: () => void; className: string };

function ZoneButton({ emoji, label, count, unit, onClick, className }: ZoneProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.93 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group relative flex min-h-[220px] flex-col items-center justify-center gap-4 overflow-hidden rounded-[2.5rem] bg-gradient-to-br p-8 text-center shadow-[0_25px_50px_-20px_rgba(225,29,116,0.5)] outline-none focus-visible:ring-4 focus-visible:ring-white md:min-h-[280px] ${className}`}
    >
      <span className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/30 blur-2xl" aria-hidden />
      <span className="text-7xl drop-shadow-lg transition-transform duration-300 group-active:scale-125 md:text-8xl" aria-hidden>
        {emoji}
      </span>
      <span className="font-serif text-xl font-semibold text-wine md:text-2xl">{label}</span>
      <span className="h-5 text-sm text-wine/70" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {count > 0 && (
            <motion.span key={count} className="inline-block" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
              {count} {count === 1 ? unit : unit === "kiss" ? "kisses" : `${unit}s`} sent 💌
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
