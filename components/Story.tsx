"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { sections, story, type StoryEntry } from "@/data/content";
import { cn } from "@/lib/utils";
import { Heart } from "./ui/Heart";
import { SectionHeading } from "./ui/SectionHeading";

export default function Story() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="story" className="relative px-4 py-24 md:py-32">
      <SectionHeading {...sections.story} />

      <ol ref={listRef} className="relative mx-auto max-w-5xl">
        {/* track + drawn line */}
        <div className="absolute bottom-0 left-5 top-0 w-[3px] -translate-x-1/2 rounded-full bg-petal/15 md:left-1/2" aria-hidden>
          <motion.div
            className="h-full w-full origin-top rounded-full bg-gradient-to-b from-petal via-lavender-400 to-gold-400 shadow-[0_0_12px_rgba(255,107,157,0.6)]"
            style={{ scaleY }}
          />
        </div>

        {story.map((entry, i) => (
          <Milestone key={i} entry={entry} index={i} />
        ))}
      </ol>
    </section>
  );
}

function Milestone({ entry, index }: { entry: StoryEntry; index: number }) {
  const left = index % 2 === 0;
  return (
    <li className="relative mb-14 grid pl-12 last:mb-0 md:mb-20 md:grid-cols-2 md:pl-0">
      {/* blooming heart on the line */}
      <motion.span
        className="absolute left-5 top-6 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-[0_0_0_6px_rgba(255,143,171,0.2),0_0_20px_rgba(255,107,157,0.5)] md:left-1/2"
        initial={{ scale: 0, rotate: -45 }}
        whileInView={{ scale: [0, 1.4, 1], rotate: 0 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        aria-hidden
      >
        <Heart className="h-4 w-4 text-petal" />
      </motion.span>

      <motion.article
        className={cn("glass overflow-hidden rounded-3xl", left ? "md:col-start-1 md:mr-12" : "md:col-start-2 md:ml-12")}
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="group relative aspect-[4/3] overflow-hidden">
          <Image
            src={entry.image}
            alt={entry.alt}
            fill
            sizes="(min-width: 768px) 460px, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wine/30 to-transparent" />
        </div>
        <div className={cn("p-5 md:p-7", left && "md:text-right")}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-500">{entry.date}</p>
          <h3 className="mt-2 font-serif text-2xl font-semibold text-wine md:text-3xl">{entry.title}</h3>
          <p className="mt-3 leading-relaxed text-wine/75">{entry.caption}</p>
        </div>
      </motion.article>
    </li>
  );
}
