# JD Albright Portfolio Website

JD Albright's portfolio site, presented as a working recreation of the Xbox 360 "Blades" dashboard.
Each blade is a section (about, experience, projects, skills, contact); highlight an item to see a summary,
select it to open the full details or follow the link.

The default modern view shows the same content as a standard portfolio page (blade-style tabs, section colours).
The button at the corner switches views; the choice is remembered, and `?view=modern` / `?view=classic`
links straight to one.

## Run it

```sh
npm run dev            # serves site/ at http://localhost:8080
```

No build step: `site/` is plain HTML, CSS and ES modules. It deploys as a Cloudflare Worker with static
assets (`wrangler.jsonc`); pushes to `main` redeploy automatically.

## Layout

| Path | Contents |
|---|---|
| `site/js/data.js` | All portfolio content: blades, items, descriptions, links (used by both views) |
| `site/index.html`, `site/js/boot.js` | Picks the view and its stylesheet; the view switch |
| `site/js/modern.js`, `site/css/modern.css` | The modern view |
| `site/js/layout.js`, `site/css/dashboard.css` | Stage size and positions |
| `site/js/blades.js`, `site/js/colorbg.js` | Blade strips (SVG) and the colour background |
| `site/js/main.js`, `site/js/input.js` | State, blade switching, panels; mouse, touch, keyboard and controller input |
| `site/assets/` | Dashboard images and sounds, plus `images/portfolio/` for the site's own images |
| `tools/shot.mjs` | Screenshot the site (optionally diff it against an image) |
| `tools/icons.py` | Redraws the icons the console only ships at 32px as SVGs |

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
