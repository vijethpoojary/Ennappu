import { HEART_PATH } from "./heart";
import { isMobileDevice, pick, prefersReducedMotion, rand, shuffle } from "./utils";

/**
 * One shared full-screen canvas for every emoji / heart effect on the site.
 * - Emoji are pre-rendered once into sprite canvases (drawImage is far cheaper than fillText).
 * - The rAF loop only runs while particles exist and stops itself when idle.
 * - Particle counts are capped and scaled down on phones and for reduced motion.
 */

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  g: number;
  drag: number;
  rot: number;
  vr: number;
  size: number;
  age: number;
  life: number;
  sprite: HTMLCanvasElement;
  wob: number;
  wobF: number;
  phase: number;
  shrink: boolean;
};

type Emitter = { remaining: number; rate: number; acc: number; spawn: () => void };

export type Range = [number, number];
type Point = { x: number; y: number };

const SPRITE = 72;
const EMOJI_FONT = `56px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif`;
const TRAIL_COLORS = ["#ff6b9d", "#ff8fab", "#f9a8d4", "#e11d74", "#b794f4"];

class ParticleEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private list: Particle[] = [];
  private emitters: Emitter[] = [];
  private sprites = new Map<string, HTMLCanvasElement>();
  private raf = 0;
  private last = 0;
  private dpr = 1;
  private w = 0;
  private h = 0;

  private get mobile() {
    return isMobileDevice();
  }

  private get cap() {
    return this.mobile ? 500 : 1800;
  }

  /** Scale a "desktop" particle count to the current device / motion preference. */
  scale(count: number) {
    const f = prefersReducedMotion() ? 0.15 : this.mobile ? 0.4 : 1;
    return Math.max(1, Math.round(count * f));
  }

  private ensure() {
    if (typeof window === "undefined") return false;
    if (this.canvas) return true;
    const c = document.createElement("canvas");
    c.setAttribute("aria-hidden", "true");
    Object.assign(c.style, {
      position: "fixed",
      inset: "0",
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: "90",
    } satisfies Partial<CSSStyleDeclaration>);
    document.body.appendChild(c);
    this.canvas = c;
    this.ctx = c.getContext("2d");
    this.resize();
    window.addEventListener("resize", this.resize);
    return !!this.ctx;
  }

  private resize = () => {
    if (!this.canvas) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, this.mobile ? 1.5 : 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.round(this.w * this.dpr);
    this.canvas.height = Math.round(this.h * this.dpr);
  };

  private sprite(key: string) {
    let s = this.sprites.get(key);
    if (s) return s;
    s = document.createElement("canvas");
    s.width = s.height = SPRITE;
    const c = s.getContext("2d")!;
    if (key.startsWith("heart:")) {
      const color = key.slice(6);
      c.translate(6, 9);
      c.scale(0.6, 0.6);
      const grad = c.createLinearGradient(0, 0, 100, 90);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.25, color);
      grad.addColorStop(1, color);
      c.fillStyle = grad;
      c.fill(new Path2D(HEART_PATH));
    } else {
      c.font = EMOJI_FONT;
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(key, SPRITE / 2, SPRITE / 2 + 4);
    }
    this.sprites.set(key, s);
    return s;
  }

  private add(p: Omit<Particle, "age" | "sprite"> & { key: string }) {
    if (this.list.length >= this.cap) return;
    const { key, ...rest } = p;
    this.list.push({ ...rest, age: 0, sprite: this.sprite(key) });
  }

  private start() {
    if (this.raf) return;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.tick);
  }

  private tick = (now: number) => {
    const ctx = this.ctx;
    const canvas = this.canvas;
    if (!ctx || !canvas) {
      this.raf = 0;
      return;
    }
    const dt = Math.min(0.05, (now - this.last) / 1000);
    this.last = now;

    for (let i = this.emitters.length - 1; i >= 0; i--) {
      const e = this.emitters[i];
      e.acc += e.rate * dt;
      while (e.acc >= 1 && e.remaining > 0) {
        e.spawn();
        e.acc -= 1;
        e.remaining -= 1;
      }
      if (e.remaining <= 0) this.emitters.splice(i, 1);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { dpr, h } = this;
    const list = this.list;
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      p.age += dt;
      const offscreen = (p.y > h + 80 && p.vy > 0) || (p.y < -80 && p.vy < 0 && p.g <= 0);
      if (p.age >= p.life || offscreen) {
        list[i] = list[list.length - 1];
        list.pop();
        continue;
      }
      const d = Math.pow(p.drag, dt * 60);
      p.vx *= d;
      p.vy = p.vy * d + p.g * dt;
      p.x += (p.vx + (p.wob ? Math.sin(p.age * p.wobF + p.phase) * p.wob : 0)) * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;

      const t = p.age / p.life;
      ctx.globalAlpha = t < 0.06 ? t / 0.06 : t > 0.7 ? (1 - t) / 0.3 : 1;
      const s = ((p.shrink ? 1 - t * 0.8 : 1) * p.size * dpr) / SPRITE;
      const cos = Math.cos(p.rot) * s;
      const sin = Math.sin(p.rot) * s;
      ctx.setTransform(cos, sin, -sin, cos, p.x * dpr, p.y * dpr);
      ctx.drawImage(p.sprite, -SPRITE / 2, -SPRITE / 2);
    }
    ctx.globalAlpha = 1;

    if (list.length === 0 && this.emitters.length === 0) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.raf = 0;
      return;
    }
    this.raf = requestAnimationFrame(this.tick);
  };

  /* -------------------- public effects -------------------- */

  /** Radial burst of emoji from a point (viewport coordinates). */
  burst(
    x: number,
    y: number,
    o: {
      emojis: readonly string[];
      count: number;
      speed?: Range;
      size?: Range;
      life?: Range;
      gravity?: number;
      drag?: number;
      angle?: number;
      spread?: number;
    },
  ) {
    if (!this.ensure()) return;
    const n = this.scale(o.count);
    const [s0, s1] = o.speed ?? [150, 420];
    const [z0, z1] = o.size ?? [16, 30];
    const [l0, l1] = o.life ?? [1, 1.8];
    for (let i = 0; i < n; i++) {
      const a = (o.angle ?? -Math.PI / 2) + rand(-1, 1) * (o.spread ?? Math.PI);
      const sp = rand(s0, s1);
      this.add({
        key: pick(o.emojis),
        x,
        y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        g: o.gravity ?? 280,
        drag: o.drag ?? 0.965,
        rot: rand(-0.4, 0.4),
        vr: rand(-3, 3),
        size: rand(z0, z1),
        life: rand(l0, l1),
        wob: 0,
        wobF: 0,
        phase: 0,
        shrink: false,
      });
    }
    this.start();
  }

  /** Emoji raining from the top of the screen. */
  rain(emojis: readonly string[], o: { count: number; duration?: number }) {
    if (!this.ensure()) return;
    const n = this.scale(o.count);
    const mobile = this.mobile;
    this.emitters.push({
      remaining: n,
      rate: n / (o.duration ?? 1.4),
      acc: 0,
      spawn: () =>
        this.add({
          key: pick(emojis),
          x: rand(0, this.w),
          y: rand(-70, -20),
          vx: rand(-25, 25),
          vy: rand(140, 340),
          g: 160,
          drag: 0.995,
          rot: rand(-0.5, 0.5),
          vr: rand(-1.5, 1.5),
          size: mobile ? rand(20, 34) : rand(24, 44),
          life: 8,
          wob: rand(15, 45),
          wobF: rand(1.5, 3.5),
          phase: rand(0, 6.28),
          shrink: false,
        }),
    });
    this.start();
  }

  /** Turn a cloud of points (e.g. sampled text pixels) into floating emoji. */
  explode(points: Point[], center: Point, emojis: readonly string[]) {
    if (!this.ensure()) return;
    const max = prefersReducedMotion() ? 140 : this.mobile ? 420 : 1600;
    const pts = points.length > max ? shuffle(points.slice()).slice(0, max) : points;
    const mobile = this.mobile;
    for (const p of pts) {
      const dx = p.x - center.x;
      const dy = p.y - center.y;
      const d = Math.hypot(dx, dy) || 1;
      const sp = rand(60, mobile ? 260 : 380);
      this.add({
        key: pick(emojis),
        x: p.x,
        y: p.y,
        vx: (dx / d) * sp + rand(-60, 60),
        vy: (dy / d) * sp * 0.7 + rand(-160, 10),
        g: rand(-90, -25),
        drag: 0.97,
        rot: rand(-0.5, 0.5),
        vr: rand(-2, 2),
        size: mobile ? rand(12, 22) : rand(14, 30),
        life: rand(2.6, 4.8),
        wob: rand(0, 30),
        wobF: rand(1, 3),
        phase: rand(0, 6.28),
        shrink: false,
      });
    }
    this.start();
  }

  /** Desktop cursor trail: a single tiny heart. */
  trail(x: number, y: number) {
    if (!this.ensure()) return;
    this.add({
      key: `heart:${pick(TRAIL_COLORS)}`,
      x: x + rand(-4, 4),
      y: y + rand(-4, 4),
      vx: rand(-20, 20),
      vy: rand(-50, -15),
      g: -10,
      drag: 0.96,
      rot: rand(-0.4, 0.4),
      vr: rand(-1, 1),
      size: rand(9, 17),
      life: rand(0.7, 1.1),
      wob: 0,
      wobF: 0,
      phase: 0,
      shrink: true,
    });
    this.start();
  }

  /** Mobile tap ripple: a small ring of hearts. */
  ripple(x: number, y: number) {
    if (!this.ensure()) return;
    const n = 9;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      this.add({
        key: `heart:${pick(TRAIL_COLORS)}`,
        x,
        y,
        vx: Math.cos(a) * 150,
        vy: Math.sin(a) * 150,
        g: -30,
        drag: 0.9,
        rot: a + Math.PI / 2,
        vr: 0,
        size: rand(10, 15),
        life: 0.75,
        wob: 0,
        wobF: 0,
        phase: 0,
        shrink: true,
      });
    }
    this.start();
  }

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.list = [];
    this.emitters = [];
    if (typeof window !== "undefined") window.removeEventListener("resize", this.resize);
    this.canvas?.remove();
    this.canvas = null;
    this.ctx = null;
  }
}

export const particles = new ParticleEngine();
