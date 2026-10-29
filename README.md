# JD Albright Portfolio Website

JD Albright's portfolio site, presented as a working recreation of the Xbox 360 "Blades" dashboard.
Each blade is a section (about, experience, projects, skills, contact); highlight an item to see a summary,
select it to open the full details or follow the link.

## Run it

```sh
npm run dev            # serves site/ at http://localhost:8080
```

No build step: `site/` is plain HTML, CSS and ES modules. Deploy `site/` as-is (Cloudflare Pages: no build
command, output directory `site`).

## Layout

| Path | Contents |
|---|---|
| `site/js/data.js` | All portfolio content: blades, items, descriptions, links |
| `site/js/layout.js`, `site/css/dashboard.css` | Stage size and positions |
| `site/js/blades.js`, `site/js/colorbg.js` | Blade strips (SVG) and the colour background |
| `site/js/main.js`, `site/js/input.js` | State, blade switching, panels; mouse, touch, keyboard and controller input |
| `site/assets/` | Dashboard images and sounds, plus `images/portfolio/` for the site's own images |
| `tools/shot.mjs` | Screenshot the site (optionally diff it against an image) |

## Controls

| Action | Mouse | Touch | Keyboard |
|---|---|---|---|
| Switch blade | Click a blade tab; horizontal or Shift+wheel | Swipe left/right | ←/→, PgUp/PgDn |
| Move highlight | Hover; wheel | Drag up/down | ↑/↓ |
| Select | Click | Tap | Enter/Space |
| Back | "B Back", browser Back | Back gesture | Esc/Backspace |

A controller works too (loaded only when one connects).

## Screenshots

```sh
npm install            # Playwright, pixelmatch, pngjs (dev only)
npx playwright install chromium
node tools/shot.mjs --hash '#/projects' --out shot.png [--ref other.png --diff diff.png]
```

## Credits

A fan-made tribute, not affiliated with or endorsed by Microsoft. Xbox, Xbox 360 and the dashboard's
artwork, sounds and ConvectionUI font belong to Microsoft. Selawik (fallback font) is © Microsoft under the
SIL Open Font License.
