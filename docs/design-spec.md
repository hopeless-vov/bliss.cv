# Windows XP Desktop — Design Spec

The single source of visual truth for **bliss.cv**, reverse-engineered 1:1 from
`example.html`. The literal, unescaped originals live in
[`reference/xp-template.html`](reference/xp-template.html) (markup + inline
styles) and [`reference/xp-logic.txt`](reference/xp-logic.txt) (component logic,
SVG icon paths). When a pixel value is in doubt, those files win.

Global font stack: `Tahoma, 'Trebuchet MS', sans-serif`. Display/branding uses
`'Trebuchet MS', Tahoma, sans-serif`. Meta labels use `'Courier New', monospace`.

## Deliberate deviations from the reference

Product decisions, not omissions — the sections below describe what's actually
implemented, not the literal original bundle:

- **No CRT overlay.** The original's scanline/vignette toggle was cut; it added
  visual noise without much payoff for a portfolio meant to be read.
- **Stacking order changed: the open window renders above sticky notes**, not
  below. The original bundle never needed this rule (notes and the window never
  competed for the same space in its model); ours does, and an open "page"
  should never hide under a note. See [Interactions](#interactions) below.
- **Wallpapers are bundled local photos** (`src/assets/*.webp`), not remote
  URLs, and **Bliss is its own distinct wallpaper** (the real default Windows
  XP photo) separate from **Green Hills** — the original spec only had one
  "Green Hills" placeholder image.
- **Multiple windows open at once.** The reference showed one window at a time;
  ours lets windows coexist — each with its own position, minimize/maximize
  state and stacking order, raised on click like real Windows. See
  [Window model](#window-model--multiple-windows) below.
- **Accessibility beyond the reference:** each window is a non-modal
  `role="dialog"` labelled by its title; focus moves into a window when it opens
  or is restored (windows coexist, so focus is *not* trapped), Escape closes the
  focused window, and desktop icons open on Enter. Windows also get a subtle
  scale+fade open/close animation (disabled under `prefers-reduced-motion`).

---

## Colour tokens

All tokens are defined in [`src/styles/main.css`](../src/styles/main.css) under
`@theme` and consumed as first-class Tailwind classes (`bg-luna-blue`, …). Multi-
stop gradients are load-bearing for the Luna look — reproduce exactly.

| Area | Token / value |
|---|---|
| Desktop fallback | `#3a6ea5` (XP steel blue, under wallpaper) |
| Root background | `#235cdc` |
| Boot / shutdown | `#000` |
| Taskbar gradient | `linear-gradient(to bottom, #245edb 0%, #3f8cf3 9%, #245edb 18%, #245edb 92%, #1941a5 100%)` |
| Start button | `linear-gradient(to bottom, #5eac56 0%, #3c8d3c 100%)`, radius `0 12px 12px 0` |
| Windows flag | `#f04e23` / `#79c539` / `#00a4ef` / `#fdbb00`, `skewY(-8deg)` |
| Title bar (active) | `linear-gradient(to bottom, #0058e6 0%, #3a93ff 8%, #288eff 40%, #127dff 88%, #036bfe 100%)`, text-shadow `#00138c` |
| Window border | `#0831d9` (1px) |
| Window face | `#ece9d8` (Luna beige) |
| Content area | `#fff`, inner border `#aca899` |
| Menu / hover | `#316ac5` (bg, text → white) |
| Min/Max button | `linear-gradient(to bottom, #2a7fff, #0054e3)` |
| Close button | `linear-gradient(to bottom, #e98b7e 0%, #d84534 50%, #c42713 51%, #e03b26 100%)` |
| Clock tray | `linear-gradient(to bottom, #1290e9 0%, #0e72bd 100%)` |
| Taskbar app btn | normal `#1e52b7→#16408f`; active `#4a90ff→#2a62c8` |
| Start menu header | `linear-gradient(to bottom, #1c60d0, #3f8cf3 50%, #1c60d0)`, border `#0054e3`, orange divider `#f5a623` |
| Start menu right col | bg `#d3e5fa`, border `#99c8fc`, text `#1a3d7c` |
| Content headings | `#003399`; body text `#3d3d3d`; meta `#6b6b6b`; links `#0044cc`/`#0058e6` |
| Sticky note | bg `#fdf7b2`, border `#c9bd5a`, header `#f5e97a→#e8d95c`, text `#3d3410` |
| Boot accents | `#ff8c00` (XP), loader blocks `#7ba8f0→#2a52c8`, subtitle `#d8d8d8` |

## Layout

- **Screen** `100vw×100vh`, `overflow:hidden`, dynamic `cursor`.
- **Desktop** `inset 0 0 32px 0`; `#3a6ea5` + wallpaper `cover/center`.
- **Taskbar** 32px tall, `z-1000`: Start pill (left) · open-window buttons (center) · clock tray (right).
- **Start menu** 380px, `z-1001`, opens from `bottom:32px left:0`: header (VB avatar + name) → two columns (left = experience files, right = About/Skills/Education/Resume/Contact) → footer (Turn Off Computer).

## Desktop icons (12)

82px column, 40px glyph (`.svg` component), 11px white label. Positions persist in
`localStorage['xp-icon-pos']`; grid origin `x=14+col*92, y=14+row*94`.

| id | label | icon | action |
|---|---|---|---|
| vesper | Vesper.exe | briefcase | window |
| worth | Worth_Systems.doc | briefcase | window |
| frozeneon | Frozeneon.vue | briefcase | window |
| quinta | QuintaGroup.js | briefcase | window |
| surelock | SureLock_Key.zip | briefcase | window |
| about | About_Me.txt | person | window |
| skills | Skills.txt | notepad | window |
| education | Education.doc | grad-cap | window |
| contact | Contact_Me.eml | mail | window |
| resume | CV_Volodymyr.pdf | pdf | open PDF in new tab |
| newNote | Leave_a_Note.txt | sticky-note | spawn note |
| recycle | Recycle Bin | bin | window (archived experience), bottom-right |

## Window model — **multiple windows**

Windows open side by side — each an entry in the windows store with its own
position, minimize/maximize state and stacking order (`z`). Opening a file
that's already open focuses its existing window instead of duplicating it; the
first window centres and each further one cascades `+18px` off the focused one
(unless maximized). Clicking a window — or its taskbar button — raises it to the
top; the top-most non-minimized window is "focused" (active title bar) and its
id is mirrored in the URL. Minimizing drops a window from the DOM (the taskbar
still lists it); restoring brings it back and forward. **First-time visitors**
land on About + Contact already open (About upper-right and focused, Contact
lower-left) — seeded once, gated by `xp-visited`. Chrome: outer `#ece9d8` +
`1px #0831d9`, radius `8px 8px 0 0`,
default `width:min(740px,94vw)`, `height:min(540px,100vh-90px)`, centered. Title
bar (icon + `C:\Portfolio\<label>` + minimize/maximize/close 21×21) → menubar
(File/Edit/View/Help) → white content area (`padding:36px 48px`, `user-select:text`):
Courier meta → `#003399` h1 → intro → sections (h2 + `<p>` + `<ul>`).

Windows map to CV: about, vesper, worth, frozeneon, quinta, surelock, skills,
education, contact, recycle (archived: Freelance, Logos mentoring).

## Boot / shutdown

- **Boot** (`z-7000`, black): the "Bondarenko® / Volodymyr®cv" logotype (a play on the "Microsoft® / Windows®xp" lockup — `cv` in Luna orange) with a large XP flag to the right of the "Bondarenko®" line, bottom-aligned so it tucks close to "Volodymyr®cv" below + a 220×18 loader (3 blue blocks, `xpload` 1.6s linear infinite). Auto-dismiss after **3.4s** or click to skip. Straight to the desktop afterwards — no welcome balloon.
- **Shutdown** (`z-5000`, black): orange "It is now safe to close this tab." Click → reboot (re-runs boot).

## Interactions

Open several windows at once · click a window or its taskbar button to raise it
· drag windows by title bar (clamped, disabled when maximized) ·
minimize/maximize (title dbl-click toggles max) · close · icons: single-click select,
click-selected or dbl-click opens (single tap opens on phone-sized viewports),
draggable with persisted positions · start menu toggles,
closes on desktop click · desktop right-click context menu (New Note, Arrange
Icons, Cursor ▶, Wallpaper ▶, Properties) · cursor swap
(`default/crosshair/wait/help`, applied via native Tailwind `cursor-*`
utilities) · wallpaper swap · sticky notes: a local scratchpad — spawn, drag,
edit, delete (persisted to localStorage, no backend) · clock ticks every **15s**.

### Stacking order (z-index)

Lowest to highest: desktop icons (auto) → sticky notes (`z-60`) → windows
(the `z-window` band: `z-index: calc(100 + var(--stack))`) → taskbar (`z-1000`)
→ start menu (`z-1001`) → context menu (`z-3000`) → shutdown screen (`z-5000`) →
boot screen (`z-7000`). The base lives in the
`.z-window` token; each window sets only its `--stack` inline — a compact 1..n
rank (re-normalised on add/focus/close), so it can never climb into the taskbar
band. Windows keep a stable DOM order (insertion order) and stack purely by
`--stack`, so raising one never reorders the DOM (which would drop text
selections mid-click). The window-above-notes rule is a deliberate deviation —
see above.

## Config / persistence

localStorage: `xp-icon-pos`, `xp-wallpaper`, `xp-cursor`, `xp-notes`,
`xp-assistant`, `xp-assistant-name`, `xp-visited` (set after the first visit;
gates the default About + Contact window layout).
Assets: wallpapers are bundled local photos in `src/assets/`
(Bliss is the default), icons are real `.svg` files under `src/assets/icons/`
imported as components via `vite-svg-loader` (`?component`), cursors are native
CSS via Tailwind utilities, resume → `public/CV_Volodymyr.pdf`. The desktop UI
itself has **no sounds**; the optional desktop assistant (vendored clippyjs,
`src/lib/clippy/`) carries its own classic mp3 effects, which play — subject to
the browser autoplay policy — while its animations run.
