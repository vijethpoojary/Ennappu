/**
 * ============================================================
 *  EDIT EVERYTHING HERE ❤️
 *  All names, text, dates and photos live in this file.
 *  Images go in /public/images.
 * ============================================================
 */

export const names = {
  her: "Chinchu",
  me: "Vijju",
} as const;

export const site = {
  title: "For Chinchu ❤️",
  description: `A little universe made by ${names.me}, for ${names.her}, with all my love.`,
  // Change this to your Vercel URL after deploying (used for link previews)
  url: "https://for-chinchu.vercel.app",
};

/* ---------------- Intro ---------------- */
export const intro = {
  loadingText: "Load avondundu untule churu😁…",
  balloonPrompt: `Pop the balloons for ${names.her} 🎈 (Onjonji balloon pudapule😁)`,
  balloonHint: "Onjonji balloon onjonji letter 😁…",
  balloonCount: { mobile: 15, desktop: 20 },
  heartPrompt: "Ende heartda mith othule 👀 enna tigale open malpule 👀😁💗",
  skipLabel: "Skip intro",
};

/* ---------------- Hero + name blast ---------------- */
export const hero = {
  eyebrow: "Enna mokeda bodedig🫂🫂❤️❤️",
  headline: `I love you cho much much much enna muddu kinni bangaruuu bodedi🫂🫂❤️❤️`,
  subtitle: `From erna mokeda mnku😁`,
  replayLabel: "Replay ✨",
};

export const nameBlast = {
  text: names.her,
  emojis: ["❤️", "💖", "💕", "💗", "💞", "🤗", "💋", "😘"],
};

/* ---------------- Section headings ---------------- */
export const sections = {
  story: { eyebrow: "chapter by chapter", title: "Nammonji kinni story😁", subtitle: "Every moment that led me to you, and you to me." },
  gallery: { eyebrow: "frozen in time", title: "Our Memories", subtitle: "Tap any photo to see it bigger." },
  reasons: { eyebrow: "just a few of a million", title: "Reasons I Love You", subtitle: "Tap a card to reveal a reason." },
  hugKiss: { eyebrow: "for when I'm not there", title: "Hugs & Kisses", subtitle: "Unlimited supply. Tap as many times as you like." },
  letter: { eyebrow: "sealed with love", title: "A Letter For You", subtitle: "Break the seal whenever you're ready." },
  countdown: { eyebrow: "every second counts", title: "Together For", subtitle: "and I'd choose you in every single one of them." },
  stars: { eyebrow: "look up, my love", title: "Our Starry Night", subtitle: "Some stars are hiding little notes. Tap the glowing ones." },
};

/* ---------------- Navbar ---------------- */
export const nav = [
  { id: "story", label: "Story" },
  { id: "gallery", label: "Gallery" },
  { id: "reasons", label: "Reasons" },
  { id: "hugs", label: "Hugs" },
  { id: "letter", label: "Letter" },
  { id: "together", label: "Together" },
  { id: "stars", label: "Stars" },
];

/* ---------------- Our Story (6 milestones) ---------------- */
export type StoryEntry = {
  date: string;
  title: string;
  caption: string;
  image: string;
  alt: string;
};

export const story: StoryEntry[] = [
  {
    date: "The very beginning",
    title: "The day we met",
    caption: "I had no idea that one ordinary day would quietly become the most important day of my life.",
    image: "/images/story-1.svg",
    alt: "The day we met",
  },
  {
    date: "Soon after",
    title: "Talking till 3 AM",
    caption: "Hours felt like minutes. We talked about everything and nothing, and I never wanted it to end.",
    image: "/images/story-2.svg",
    alt: "Late night conversations",
  },
  {
    date: "Our first date",
    title: "Butterflies, everywhere",
    caption: "You laughed at my silly jokes and I forgot how to breathe for a second.",
    image: "/images/story-3.svg",
    alt: "Our first date",
  },
  {
    date: "The moment I knew",
    title: "It was you. Always you.",
    caption: "Somewhere between your smile and your kindness, I realised my heart had already chosen.",
    image: "/images/story-4.svg",
    alt: "The moment I knew",
  },
  {
    date: "Our adventures",
    title: "Exploring the world together",
    caption: "Every place is beautiful when your hand is in mine.",
    image: "/images/story-5.svg",
    alt: "Travelling together",
  },
  {
    date: "Today & forever",
    title: "Still falling for you",
    caption: "Every day with you is my favourite chapter, and I can't wait to write the rest.",
    image: "/images/story-6.svg",
    alt: "Us today",
  },
];

/* ---------------- Gallery ---------------- */
export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
};

// width/height are the photo's real proportions (any size is fine, e.g. 4000x3000)
export const gallery: GalleryImage[] = [
  { src: "/images/gallery-1.svg", alt: "Memory 1", caption: "That smile 💕", width: 800, height: 1000 },
  { src: "/images/gallery-2.svg", alt: "Memory 2", caption: "Our favourite place", width: 800, height: 600 },
  { src: "/images/gallery-3.svg", alt: "Memory 3", caption: "Silly us", width: 800, height: 800 },
  { src: "/images/gallery-4.svg", alt: "Memory 4", caption: "Golden hour", width: 800, height: 1100 },
  { src: "/images/gallery-5.svg", alt: "Memory 5", caption: "Coffee dates ☕", width: 800, height: 650 },
  { src: "/images/gallery-6.svg", alt: "Memory 6", caption: "My whole world", width: 800, height: 950 },
  { src: "/images/gallery-7.svg", alt: "Memory 7", caption: "Adventures 🌍", width: 800, height: 700 },
  { src: "/images/gallery-8.svg", alt: "Memory 8", caption: "Just us", width: 800, height: 1050 },
  { src: "/images/gallery-9.svg", alt: "Memory 9", caption: "Forever ❤️", width: 800, height: 800 },
];

/* ---------------- Reasons I love you ---------------- */
export const reasons: { emoji: string; text: string }[] = [
  { emoji: "😊", text: "Your smile makes even my worst days feel light." },
  { emoji: "🫶", text: "You care for everyone with your whole heart." },
  { emoji: "😂", text: "You laugh at my jokes, even the terrible ones." },
  { emoji: "🌙", text: "You're the last thought before I sleep and the first when I wake." },
  { emoji: "🏡", text: "With you, anywhere feels like home." },
  { emoji: "✨", text: "You make ordinary moments feel magical." },
  { emoji: "💪", text: "You're stronger than you know, and you inspire me every day." },
  { emoji: "🤗", text: "Your hugs fix everything. Literally everything." },
  { emoji: "🎶", text: "The way you hum when you're happy." },
  { emoji: "👀", text: "The way you look at me like I'm your favourite person." },
  { emoji: "🌸", text: "You're beautiful inside and out." },
  { emoji: "♾️", text: "Because loving you is the easiest thing I've ever done." },
];

/* ---------------- Hug & kiss zone ---------------- */
export const hugKiss = {
  hugLabel: "Tap here for a hug 🤗",
  kissLabel: "Tap here for a kiss 💋",
  hugEmojis: ["🤗", "💞", "🧸", "💗", "🫂"],
  kissEmojis: ["💋", "😘", "💖", "💕", "😚"],
  rainCount: 240, // per tap on desktop (automatically reduced on phones)
};

/* ---------------- Love letter ---------------- */
export const letter = {
  envelopeLabel: `For my ${names.her}`,
  sealHint: "Tap the seal to open",
  greeting: `My dearest ${names.her},`,
  lines: [
    "I don't know how to put everything I feel into words, but I'll try.",
    "From the moment you came into my life, everything became brighter, softer, and more beautiful.",
    "You are my calm on stormy days and my sunshine on the good ones.",
    "Thank you for loving me the way you do, for your patience, your laughter, and your endless kindness.",
    "I promise to hold your hand through everything, to make you smile when you're sad, and to love you a little more every single day.",
    "You are my today, my tomorrow, and my forever.",
  ],
  closing: "Forever yours,",
  signature: names.me,
};

/* ---------------- Countdown ---------------- */
export const together = {
  // The date & time you got together (ISO format, with your timezone offset)
  date: "2023-02-14T18:30:00+05:30",
  footnote: "since the day you said yes 💍",
};

/* ---------------- Starry night notes ---------------- */
export const starNotes: string[] = [
  "You are my favourite hello and my hardest goodbye.",
  "I'd find you in every lifetime.",
  "You make my heart do little cartwheels.",
  "Every love song makes sense now.",
  "I love you more than all the stars in this sky.",
  "Your laugh is my favourite sound.",
  "Home is wherever you are.",
  "You + me = my favourite equation.",
  "Thank you for choosing me, every day.",
  "Forever isn't long enough with you.",
];

/* ---------------- Footer ---------------- */
export const footer = {
  line: `Made with love by ${names.me}, for ${names.her} ❤️`,
  sub: "Forever & always",
};
