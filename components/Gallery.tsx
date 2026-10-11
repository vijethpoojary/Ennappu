"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gallery, sections } from "@/data/content";
import { SectionHeading } from "./ui/SectionHeading";

const TILTS = [-3, 2.5, -1.5, 3, -2.5, 1.5, -2, 2, -1];

const slide: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? 320 : -320, opacity: 0, scale: 0.95 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -320 : 320, opacity: 0, scale: 0.95 }),
};

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const [dir, setDir] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const n = gallery.length;

  const go = useCallback(
    (d: number) => {
      setDir(d);
      setIndex((i) => (i === null ? null : (i + d + n) % n));
    },
    [n],
  );

  const close = useCallback(() => {
    setIndex(null);
    triggerRef.current?.focus();
  }, []);

  const isOpen = index !== null;

  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add("scroll-locked");
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("scroll-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, go, close]);

  return (
    <section id="gallery" className="relative px-4 py-24 md:py-32">
      <SectionHeading {...sections.gallery} />

      <div className="mx-auto max-w-6xl columns-2 gap-3 sm:gap-5 md:columns-3">
        {gallery.map((img, i) => (
          <motion.figure
            key={img.src}
            className="relative mb-4 break-inside-avoid sm:mb-6"
            initial={{ opacity: 0, y: 40, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: TILTS[i % TILTS.length] }}
            whileHover={{ rotate: 0, scale: 1.04, zIndex: 10 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 140, damping: 16 }}
          >
            <button
              type="button"
              onClick={(e) => {
                triggerRef.current = e.currentTarget;
                setDir(0);
                setIndex(i);
              }}
              className="group block w-full rounded-sm bg-white p-2 pb-3 text-left shadow-[0_12px_30px_-10px_rgba(90,26,63,0.35)] outline-none focus-visible:ring-4 focus-visible:ring-petal/50 sm:p-3 sm:pb-4"
              aria-label={`Open photo: ${img.caption}`}
            >
              <span className="relative block overflow-hidden bg-blush-100">
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="h-auto w-full transition-transform duration-700 group-hover:scale-110"
                  unoptimized={img.src.endsWith(".svg")}
                />
              </span>
              <figcaption className="mt-2 text-center font-hand text-lg text-wine/80 sm:text-xl">{img.caption}</figcaption>
            </button>
          </motion.figure>
        ))}
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
            className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-midnight-900/90 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20"
            >
              ×
            </button>

            <div className="relative h-[68svh] w-full max-w-4xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={index}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70 || info.velocity.x < -500) go(1);
                    else if (info.offset.x > 70 || info.velocity.x > 500) go(-1);
                  }}
                  className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
                >
                  <Image
                    src={gallery[index].src}
                    alt={gallery[index].alt}
                    fill
                    sizes="100vw"
                    draggable={false}
                    className="pointer-events-none select-none object-contain"
                    unoptimized={gallery[index].src.endsWith(".svg")}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-4 flex w-full max-w-4xl items-center justify-between gap-4 text-white" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl hover:bg-white/20">
                ‹
              </button>
              <div className="text-center" aria-live="polite">
                <p className="font-hand text-2xl">{gallery[index].caption}</p>
                <p className="text-xs text-white/60">
                  {index + 1} / {n} · swipe or use arrows
                </p>
              </div>
              <button type="button" onClick={() => go(1)} aria-label="Next photo" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl hover:bg-white/20">
                ›
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
