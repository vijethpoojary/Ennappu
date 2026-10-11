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
  letter: { eyebrow: "sealed with love", title: "A Letter For You", subtitle: "Break the seal whenever you're ready." },
};

/* ---------------- Navbar ---------------- */
export const nav = [
  { id: "story", label: "Story" },
  { id: "gallery", label: "Gallery" },
  { id: "hugs", label: "Hugs" },
  { id: "letter", label: "Letter" },
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
    title: "Eer kopad kuldipvar😁",
    caption: "Iam just thinking , dadandu enna babugndu🤔",
    image: "/images/story-1.png",
    alt: "The day we met",
  },
  {
    date: "Soon after",
    title: "So enk gothand😁 ",
    caption: "Enna babug Panipuri bodundu , So Yan enna kaiyaare enna babug panipuri malthe 😁",
    image: "/images/story-2.png",
    alt: "Late night conversations",
  },
  {
    date: "Panipuri Andu 😁🥳",
    title: "Babuna roomg batthe 😁😁",
    caption: "Babun Jakkeld kuchad , cheepeda boka panipuri korye 😁🥳🥳",
    image: "/images/story-3.png",
    alt: "Our first date",
  },
  {
    date: "Finally bodedi mange aayer😁🥳",
    title: "Baabun gatttiii pathondu chochi🫂🫂😁🥳",
    caption: "Finnally babu mange aayer , nana cheepeda, jilebi, ucchu purala suru😁🥳🥳🥳 ",
    image: "/images/story-4.png",
    alt: "The moment I knew",
  },
  {
    date: "Pura ayibokka😁",
    title: "Babun nidhrerd lakkaye , sorry mage, nerorchi k🫂🫂😁🥳",
    caption: "Onji night ride poka pand avondundu bale poyi mage😁🥳🥳🥳🫂🫂",
    image: "/images/story-5.png",
    alt: "Travelling together",
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
  { src: "/images/gallery-1.png", alt: "Memory 1", caption: "Enna babu 🫂😘", width: 800, height: 1000 },
  { src: "/images/gallery-2.png", alt: "Memory 2", caption: "Enna muddu🫂😘", width: 800, height: 600 },
  { src: "/images/gallery-3.png", alt: "Memory 3", caption: "Enna bangaru 🫂😘", width: 800, height: 800 },
  { src: "/images/gallery-4.png", alt: "Memory 4", caption: "Enna kinni 🫂😘", width: 800, height: 1100 },
  { src: "/images/gallery-5.png", alt: "Memory 5", caption: "Enna bodedi 🫂😘", width: 800, height: 650 },
  { src: "/images/gallery-6.png", alt: "Memory 6", caption: "Enna chochu🫂😘", width: 800, height: 950 },
  { src: "/images/gallery-7.png", alt: "Memory 7", caption: "Enna jojju 🫂😘", width: 800, height: 700 },
  { src: "/images/gallery-8.png", alt: "Memory 8", caption: "Enna chinchu 🫂😘", width: 800, height: 1050 },
  { src: "/images/gallery-9.png", alt: "Memory 9", caption: "Enna munki👀🫂😘", width: 800, height: 800 },
];

/* ---------------- Hug & kiss zone ---------------- */
export const hugKiss = {
  hugLabel: "Ende othule full eereg tightt hug 😁🫂😘",
  kissLabel: "Ende eereg unlimited namune namuneda cheepeda 😁💋🫂😘",
  hugEmojis: ["🤗", "💞", "🧸", "💗", "🫂"],
  kissEmojis: ["💋", "😘", "💖", "💕", "😚"],
  rainCount: 240, // per tap on desktop (automatically reduced on phones)
};

/* ---------------- Love letter ---------------- */
export const letter = {
  envelopeLabel: `Enna muddu bodedig 😁🫂😘`,
  sealHint: "Open aayere click malpule😁 ",
  greeting: `Enna muddu bodedig😁💋🫂😘`,
  lines: [
    "Iam so chorry chorry chorry chorry chorry chorry chorry chorry chorry ",
    "chorry chorry chorry chorry chorry chorry chorry chorry chorry chorry chorry chorry",
    "chorry chorry chorry chorry chorry chorry chorry chorry chorry",
    "Enna muddu kinni bangaruu bodedi🫂😘🫂😘🫂😘🫂😘🫂😘🫂😘🫂😘🫂😘🫂😘🫂😘 ",
    "Eeren gatttiii pathondu muddu malthd eereg cheepeda kordu sorry panodu pand apundu jojja",
    "Eereg ini full cheepeda , adimel malthd , undud mata korpe k 😁😁🫂😘, Boka sama ucchula budpe👀👀😁😁🫂😘",
  ],
  closing: "Forever eerna mokeda mnku 😁😁🫂😘",
  signature: names.me,
};

/* ---------------- Footer ---------------- */
export const footer = {
  line: `I love you cho much much much much much much much much much enna mokeda muddu kinni bangaruu bodedi 🫂😘🫂😘🫂😘❤️🫂😘🫂😘`,
  sub: "Enna munkiii👀👀😁😁🫂🫂😘🫂😘",
};
