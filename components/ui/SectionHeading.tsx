"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Heart } from "./Heart";

type Props = { eyebrow: string; title: string; subtitle?: string; light?: boolean };

export function SectionHeading({ eyebrow, title, subtitle, light }: Props) {
  return (
    <motion.div
      className="mx-auto mb-12 max-w-2xl text-center md:mb-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <p className={cn("text-xs font-medium uppercase tracking-[0.35em]", light ? "text-gold-300" : "text-gold-500")}>{eyebrow}</p>
      <h2 className={cn("mt-3 font-script text-6xl leading-tight md:text-7xl", light ? "text-blush-200 glow-text-soft" : "text-petal glow-text")}>
        {title}
      </h2>
      <div className="mt-3 flex items-center justify-center gap-3" aria-hidden>
        <span className={cn("h-px w-12", light ? "bg-blush-200/40" : "bg-petal/40")} />
        <Heart className={cn("h-3.5 w-3.5", light ? "text-blush-200" : "text-petal")} />
        <span className={cn("h-px w-12", light ? "bg-blush-200/40" : "bg-petal/40")} />
      </div>
      {subtitle && (
        <p className={cn("mt-4 font-serif text-base italic md:text-lg", light ? "text-blush-100/80" : "text-wine/70")}>{subtitle}</p>
      )}
    </motion.div>
  );
}
