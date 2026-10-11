"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { names, nav } from "@/data/content";
import { cn } from "@/lib/utils";
import { Heart } from "./ui/Heart";

export default function Navbar({ visible }: { visible: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    nav.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3"
      initial={{ y: -100 }}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
    >
      <nav
        aria-label="Sections"
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-1.5 transition-all duration-300 md:px-6",
          (scrolled || open) && "glass",
        )}
      >
        <a href="#home" className="flex min-h-[44px] items-center gap-1.5 font-script text-3xl text-petal" aria-label="Back to top">
          {names.her[0]}
          <Heart className="h-4 w-4 animate-heartbeat text-petal" />
          {names.me[0]}
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors hover:bg-white/60",
                  active === l.id ? "bg-white/70 text-petal" : "text-wine/75",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="relative block h-3.5 w-5">
            <span className={cn("absolute left-0 top-0 h-0.5 w-5 rounded bg-wine transition", open && "top-1.5 rotate-45")} />
            <span className={cn("absolute left-0 top-1.5 h-0.5 w-5 rounded bg-wine transition", open && "opacity-0")} />
            <span className={cn("absolute left-0 top-3 h-0.5 w-5 rounded bg-wine transition", open && "top-1.5 -rotate-45")} />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            className="glass mx-auto mt-2 max-w-6xl rounded-3xl p-2 md:hidden"
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
          >
            {nav.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className={cn("block rounded-2xl px-4 py-3 font-medium", active === l.id ? "bg-white/70 text-petal" : "text-wine/80")}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
