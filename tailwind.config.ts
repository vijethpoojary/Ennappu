import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff6f9",
          100: "#ffe4ec",
          200: "#ffc9da",
          300: "#ffa3c0",
          400: "#ff8fab",
        },
        petal: "#ff6b9d",
        lavender: {
          100: "#f5edff",
          200: "#e9d8ff",
          300: "#d6bcfa",
          400: "#b794f4",
          500: "#9f7aea",
        },
        cream: "#fff8f0",
        gold: {
          300: "#f6dc9a",
          400: "#e9c46a",
          500: "#c9973a",
        },
        midnight: {
          600: "#4a1d47",
          700: "#3b1736",
          800: "#2a0f2a",
          900: "#170818",
        },
        wine: "#5a1a3f",
      },
      fontFamily: {
        script: ["var(--font-script)", "cursive"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        hand: ["var(--font-hand)", "cursive"],
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "15%": { transform: "scale(1.12)" },
          "30%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.18)" },
          "60%": { transform: "scale(1)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        heartbeat: "heartbeat 1.4s ease-in-out infinite",
        blink: "blink 1s step-end infinite",
        shimmer: "shimmer 6s linear infinite",
        "spin-slow": "spin-slow 4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
