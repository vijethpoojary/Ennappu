"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { reasons, sections } from "@/data/content";
import { particles } from "@/lib/particles";
import { sfx, unlockAudio } from "@/lib/sound";
import { Heart } from "./ui/Heart";
import { SectionHeading } from "./ui/SectionHeading";

export default function Reasons() {
  return (
    <section id="reasons" className="relative px-4 py-24 md:py-32">
      <SectionHeading {...sections.reasons} />
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {reasons.map((r, i) => (
          <ReasonCard key={i} index={i} emoji={r.emoji} text={r.text} />
        ))}
      </ul>
    </section>
  );
}

function ReasonCard({ index, emoji, text }: { index: number; emoji: string; text: string }) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    const next = !flipped;
    setFlipped(next);
    if (next && ref.current) {
      unlockAudio();
      sfx.sparkle();
      const r = ref.current.getBoundingClientRect();
      particles.burst(r.left + r.width / 2, r.top + r.height / 2, {
        emojis: ["💖", "💕", "❤️", "💗"],
        count: 30,
        speed: [140, 380],
        size: [14, 26],
      });
    }
  };

  return (
    <motion.li
      className="[perspective:1000px]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08 }}
    >
      <button
        ref={ref}
        type="button"
        onClick={toggle}
        aria-pressed={flipped}
        className="relative block h-52 w-full rounded-3xl text-left outline-none focus-visible:ring-4 focus-visible:ring-petal/40 sm:h-56 md:h-64"
      >
        <motion.span
          className="preserve-3d relative block h-full w-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 110, damping: 15 }}
        >
          {/* front */}
          <span className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl border border-white/70 bg-white/65 p-4 text-center shadow-[0_15px_35px_-15px_rgba(90,26,63,0.35)]">
            <Heart className="h-12 w-12 animate-heartbeat text-petal drop-shadow-[0_0_12px_rgba(255,107,157,0.5)] md:h-14 md:w-14" />
            <span className="font-serif text-lg font-semibold text-wine md:text-xl">Reason #{String(index + 1).padStart(2, "0")}</span>
            <span className="text-xs uppercase tracking-[0.2em] text-wine/50">tap to reveal</span>
          </span>
          {/* back */}
          <span className="backface-hidden absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl bg-gradient-to-br from-petal via-blush-400 to-lavender-400 p-4 text-center text-white shadow-[0_15px_35px_-15px_rgba(225,29,116,0.6)] [transform:rotateY(180deg)]">
            <span className="text-3xl md:text-4xl" aria-hidden>
              {emoji}
            </span>
            <span className="font-serif text-[15px] leading-snug sm:text-base md:text-lg">{text}</span>
          </span>
        </motion.span>
      </button>
    </motion.li>
  );
}
