"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { footer } from "@/data/content";
import { particles } from "@/lib/particles";
import { Heart } from "./ui/Heart";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const heartRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });

  useEffect(() => {
    if (!inView || !heartRef.current) return;
    const r = heartRef.current.getBoundingClientRect();
    particles.burst(r.left + r.width / 2, r.top + r.height / 2, {
      emojis: ["❤️", "💖", "💕"],
      count: 26,
      speed: [120, 320],
      size: [12, 22],
    });
  }, [inView]);

  return (
    <footer ref={ref} className="relative z-10 bg-midnight-900 px-4 pb-28 pt-16 text-center md:pb-16">
      <motion.span
        ref={heartRef}
        className="mx-auto mb-5 flex h-14 w-14 items-center justify-center"
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      >
        <Heart className="h-12 w-12 animate-heartbeat text-petal drop-shadow-[0_0_16px_rgba(255,107,157,0.7)]" />
      </motion.span>
      <p className="font-serif text-lg text-blush-100 md:text-xl">{footer.line}</p>
      <p className="mt-2 font-script text-3xl text-blush-300/80">{footer.sub}</p>
    </footer>
  );
}
