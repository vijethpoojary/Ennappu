"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { sections, starNotes } from "@/data/content";
import { particles } from "@/lib/particles";
import { sfx, unlockAudio } from "@/lib/sound";
import { isMobileDevice, prefersReducedMotion, rand, seeded } from "@/lib/utils";
import { SectionHeading } from "./ui/SectionHeading";

type Star = { x: number; y: number; r: number; base: number; tw: number; ph: number; c: string };
type Shooting = { x: number; y: number; vx: number; vy: number; age: number; life: number };

const STAR_COLORS = ["#ffffff", "#ffe4ec", "#f6dc9a", "#e9d8ff"];

export default function StarryNight() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [found, setFound] = useState<Set<number>>(() => new Set());

  // Deterministic positions so server and client markup match.
  const loveStars = useMemo(() => {
    const r = seeded(14);
    return starNotes.map((note, i) => ({ note, x: 8 + r() * 84, y: 34 + r() * 50, delay: r() * 2.5, i }));
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!section || !canvas || !ctx) return;

    const mobile = isMobileDevice();
    const reduced = prefersReducedMotion();
    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let shooting: Shooting | null = null;
    let nextShoot = performance.now() + rand(2000, 5000);
    let raf = 0;
    let visible = false;
    let last = performance.now();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      w = section.clientWidth;
      h = section.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const n = Math.min(mobile ? 140 : 320, Math.round((w * h) / (mobile ? 3800 : 5000)));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.08 ? rand(1.4, 2.2) : rand(0.4, 1.2),
        base: rand(0.4, 1),
        tw: rand(0.6, 2.4),
        ph: rand(0, 6.28),
        c: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      }));
      if (reduced) draw(performance.now());
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        ctx.globalAlpha = reduced ? s.base * 0.8 : s.base * (0.55 + 0.45 * Math.sin(now * 0.001 * s.tw + s.ph));
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!reduced) {
        if (!shooting && now > nextShoot) {
          const angle = rand(0.35, 0.6);
          const speed = Math.max(500, w * 0.9);
          shooting = { x: rand(0.05, 0.6) * w, y: rand(0, 0.3) * h, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, age: 0, life: 1.2 };
        }
        if (shooting) {
          const s = shooting;
          s.age += dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          const fade = 1 - s.age / s.life;
          const tx = s.x - s.vx * 0.16;
          const ty = s.y - s.vy * 0.16;
          const g = ctx.createLinearGradient(s.x, s.y, tx, ty);
          g.addColorStop(0, `rgba(255,255,255,${fade})`);
          g.addColorStop(1, "rgba(255,201,218,0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tx, ty);
          ctx.stroke();
          ctx.globalAlpha = fade;
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          if (s.age >= s.life) {
            shooting = null;
            nextShoot = now + rand(3500, 8000);
          }
        }
        if (visible) raf = requestAnimationFrame(draw);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(draw);
      } else if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    const ro = new ResizeObserver(resize);
    resize();
    io.observe(section);
    ro.observe(section);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  const reveal = (i: number, e: React.MouseEvent<HTMLButtonElement>) => {
    unlockAudio();
    sfx.sparkle();
    const r = e.currentTarget.getBoundingClientRect();
    particles.burst(r.left + r.width / 2, r.top + r.height / 2, { emojis: ["✨", "💫", "⭐", "💖"], count: 18, speed: [80, 240], gravity: 60, size: [12, 22] });
    setActive(i);
    setFound((f) => new Set(f).add(i));
  };

  return (
    <section
      id="stars"
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-[radial-gradient(ellipse_at_top,#4a1d47_0%,#2a0f2a_45%,#170818_100%)] px-4 pb-40 pt-24 md:pt-32"
    >
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />

      {/* moon */}
      <div className="pointer-events-none absolute right-[8%] top-[10%] h-20 w-20 rounded-full bg-[#fff4e0] shadow-[0_0_60px_20px_rgba(255,228,236,0.35)] md:h-28 md:w-28" aria-hidden>
        <div className="absolute -right-3 -top-2 h-full w-full rounded-full bg-[#2f1230]" />
      </div>

      <div className="relative z-10">
        <SectionHeading {...sections.stars} light />
        <p className="text-center text-sm text-blush-100/70" aria-live="polite">
          {found.size} / {starNotes.length} notes found {found.size === starNotes.length ? "💖" : "✨"}
        </p>
      </div>

      {loveStars.map((s) => (
        <button
          key={s.i}
          type="button"
          onClick={(e) => reveal(s.i, e)}
          aria-label={`Love note star ${s.i + 1}`}
          className="absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blush-200"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
        >
          <svg
            viewBox="0 0 24 24"
            className="star-twinkle h-7 w-7"
            style={{
              animationDelay: `${s.delay}s`,
              filter: `drop-shadow(0 0 6px ${found.has(s.i) ? "#e9c46a" : "#ffc9da"}) drop-shadow(0 0 14px ${found.has(s.i) ? "#e9c46a" : "#ff8fab"})`,
            }}
            aria-hidden
          >
            <path d="M12 0 C 13 8 16 11 24 12 C 16 13 13 16 12 24 C 11 16 8 13 0 12 C 8 11 11 8 12 0 Z" fill={found.has(s.i) ? "#f6dc9a" : "#ffffff"} />
          </svg>
        </button>
      ))}

      <AnimatePresence>
        {active !== null && (
          <motion.div
            key={active}
            className="glass-dark absolute inset-x-4 bottom-8 z-20 mx-auto max-w-md rounded-3xl p-6 pr-12 text-center"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            role="status"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-gold-300">note #{active + 1}</p>
            <p className="mt-2 font-hand text-2xl leading-snug text-blush-50 md:text-3xl">{starNotes[active]}</p>
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close note"
              className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-xl text-blush-100/70 hover:text-white"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
