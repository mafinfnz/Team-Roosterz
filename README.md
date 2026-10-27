# Team Roosterz — cinematic / owner content

Next.js App Router, TypeScript, React, Tailwind CSS, Framer Motion, Lenis.

## Run
```
npm ci
npm run dev
```
Production: `npm run build && npm start` (0.0.0.0:3000).

## Approved data only
Source: https://github.com/mafinfnz/nakxal, commit `98d424fed78acc0faca4dbbeac5b612a3ea470af`.

Main: gaston, kokosic147, mafin, overflod, ukkis.
Academy: sv1ntuzz, matv1k, vanya.
The owner explicitly supplied this assignment. Nicknames follow the owner's message; upstream `$v1ntuzz.png` maps to `sv1ntuzz`.

Portraits are supplied illustrations from the repository, not evidence of the players' real-world identities. Transparent borders were cropped and images converted to WebP. No inferred biographies, real names, countries, stats, tactical roles, sponsors, contacts, devices, tournament results or personal links are published. Old fabricated profiles are removed and their URLs return 404. Matches and contact sections are intentionally unpopulated. No mail form or invented email addresses remain.

## Typography
- Luckies: monumental ROOSTERZ wordmark, ROSTER heading and individual profile names. Original `Luckies.ttf`, no horizontal scaling. This font contains no Cyrillic; it is never used for Russian text.
- ONY Track UltraCondensed Black: Russian headings, navigation and remaining interface text.
Only these two fonts are shipped; the former third font, preload and all CSS references are removed.
All fonts hosted locally. No system fallback glyphs in tested text. Source repository does not state redistribution licenses; confirm rights before public distribution.

## Motion
- Whole text runs, not staggered letters. No animated blur on text.
- Hero: 1.65s feathered vertical mask + opacity. Mask padding protects Luckies ascenders.
- Page headings: 1.15s fade with a 12px vertical settle.
- Section headings: 1.35s pure opacity, no displacement.
- Profile nicknames: 1.3s fade with 10px horizontal movement.
- MAIN / ACADEMY use the restored 0.95s vertical track transition, without opacity changes. SSR renders only MAIN. useLayoutEffect sets the viewport height before mounting the second panel, preventing the first-load double-roster bug. Inactive panels are inert and aria-hidden.
- All nicknames displayed uppercase; lowercase URL slugs preserved.
- Display text narrowed 12% on a separate stable wrapper; small text uses UltraCondensed at readable sizes.
- Navigation: default App Router navigation; varied text entrances (see below).
- Grain: 13s drift. Exposure: 17s low-contrast modulation, max 8.5% darkening, no strobe.
- The effects button is removed. System reduced-motion and no-JavaScript fallbacks keep content visible.

## Checks
With the server running:
```
npx playwright install --with-deps chromium
node tests/approved-content.mjs
node tests/fonts.mjs
node tests/home-roster.mjs
```

## Minimal interface
Removed numbered section labels, player numbering, player badges (MAIN/ACADEMY), technical subtitles, card borders and card surfaces. Player cards show only their supplied image and uppercase nickname. Main/academy separation remains in section headings and tabs.

## Homepage roster
The full three-column roster gallery has moved to the homepage. MAIN / ACADEMY tabs preserve the owner-supplied grouping. Only the current group is visible; the second mounts only after the viewport is sized. On mobile the gallery uses two columns. Nicknames are centered below the photos in Luckies, matching the individual profiles.
The separate roster navigation item is removed. `/rosters` permanently redirects to `/#roster` for old bookmarks. Profile URLs remain `/rosters/[slug]`; the back link returns to `/#roster` or `/#academy` with the appropriate tab selected. Tabs support arrow keys, Home/End, reload and hash navigation.

The desktop navigation is geometrically centered in the viewport. The green active dot is removed. `node tests/content-swap.mjs` checks SSR first paint, local OUT/IN, absence of duplicate panels, unchanged page position, sentence-case titles and removal of separator lines.

`node tests/roster-slide.mjs` checks the restored slide, SSR single roster, initial clipping, opacity and mobile behavior. Route content OUT/IN, title casing and line removal are unchanged.

## Current route transitions
Default Next.js Link navigation, with no outgoing animation, delay or moving page wrapper. Text entrances vary: Matches rises through a mask, About reveals left to right, Contact drops through a mask, profile names slide horizontally, copy reveals vertically. Whole text runs, no per-letter effects. MAIN/ACADEMY retains its 0.95s vertical track. Reduced motion disables text entrances.

## Startup readiness and recovery
The initial BootScreen waits for the two local fonts and first-screen images before revealing the page. No artificial minimum wait; the reveal takes 650ms. Failed fonts or a 12s startup timeout show a retry action that reloads the document. CSP blocks external font sources (`font-src 'self'`). Only Luckies and ONY Track are declared. System glyph fallback can still occur for characters not supplied by those fonts; CSS cannot disable browser fallback globally.
Custom 404, route loading placeholder and route error boundary are included. Reduced-motion disables decorative CSS animations. Run `node tests/boot-screen.mjs` to check slow fonts, failure/retry, 404 and navigation.
