# For Chinchu ❤️

A cinematic love-story website made by Vijju, for Chinchu.
Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion and canvas-confetti.

## Run it locally

Requires Node.js 18.17 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. To test on your phone, run `npm run dev -- -H 0.0.0.0`, then open `http://<your-computer-ip>:3000` on a phone connected to the same Wi-Fi.

Production check:

```bash
npm run build
npm start
```

## Make it yours

**Everything editable lives in [`data/content.ts`](data/content.ts):** names, headline, story milestones, gallery, letter text, star notes and footer.

| What | Where |
| --- | --- |
| Photos | Put them in `public/images/` with the same names (e.g. `story-1.png`) to replace the placeholders. If you use `.jpg`, also update the path in `content.ts`. |
| Gallery photo shapes | Set `width` / `height` in `gallery` to each photo's real pixel size, or just its ratio (e.g. `3000 x 4000`). |
| Number of balloons | `intro.balloonCount` |
| Link preview URL | `site.url` (set it to your Vercel URL after deploying) |

Tip: compress photos (around 2000px on the long edge, JPG/WebP) before adding them. `next/image` handles the rest.

## How the intro works

1. **Loader**: a heart fills with pink liquid.
2. **Balloons**: each pop reveals the next letter of C-H-I-N-C-H-U. When the name is complete, the remaining balloons pop in a cascade. The first pop also unlocks the sound effects, because browsers block audio until a tap.
3. **Opening heart**: tap to swing it open like double doors and reveal the site.
4. **Name blast**: "Chinchu" glows, then every pixel bursts into hearts, hugs and kisses. Use **Replay ✨** in the hero to see it again.

A **Skip intro** button is always visible.

## Performance & accessibility

- All particle effects share one canvas with pre-rendered emoji sprites. The animation loop stops when nothing is moving, and counts are capped on phones (about 40% of desktop).
- `prefers-reduced-motion` is respected: far fewer particles, no rising or drifting motion, and no typewriter.
- Sound effects are synthesised with Web Audio, so there are no extra files to load.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to https://vercel.com/new, import the repo, and keep the defaults (framework: Next.js).
3. Click **Deploy**. Then copy the URL into `site.url` in `content.ts` and push again.

Or from the terminal: `npx vercel` (then `npx vercel --prod`).

## Project structure

```
app/            layout (fonts, SEO), page, globals.css, icon.svg (heart favicon)
components/     Intro, BalloonPop, OpeningHeart, NameBlast, Hero, Story, Gallery,
                HugKiss, Letter, Footer, FloatingHearts,
                Navbar, CursorTrail, Experience (wires it all together), ui/
data/content.ts all editable content
lib/            particles (canvas engine), sound (Web Audio sfx), confetti, hooks
public/images   your photos
```
