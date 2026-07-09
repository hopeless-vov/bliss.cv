# bliss.cv

> **bliss** — the name of the default Windows XP wallpaper (that green hill under a blue sky). This is my portfolio, rebuilt as a Windows XP desktop you can click around in.

An interactive portfolio for **ME**, styled as a full Windows XP desktop — boot screen, draggable icons, windows, taskbar, start menu, and sticky notes. My CV is the content; the OS is the interface.

---

## Requirements

| Tool    | Version |
| ------- | ------- |
| Node.js | >= 22   |
| npm     | >= 10   |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production (runs unit tests + type-check + build)
npm run build

# Preview the production build
npm run preview
```

---

## Testing

```bash
# Unit tests (Vitest) — watch mode
npm run test:unit

# Unit tests — single run
npm run test:unit:run

# Coverage (logic must stay at 100%)
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e
npm run test:e2e:ui       # with the Playwright UI
npm run test:e2e:report   # open the last HTML report
```

> First E2E run may need browsers: `npx playwright install chromium`.

Unit tests live in `tests/unit/` and cover **all logic** — composables, stores, and content shape. Coverage thresholds enforce **100%** on `src/composables`, `src/stores`, and `src/utils` (see `vite.config.ts`). E2E tests live in `tests/e2e/`.

### Verify everything

```bash
npm run verify   # lint + type-check + 100% coverage in one shot
```

Run this after any change to confirm the rules hold.

---

## Linting

```bash
npm run lint       # check
npm run lint:fix   # auto-fix
```

ESLint (flat config) + typescript-eslint + eslint-plugin-vue, with import sorting, unused-import pruning, file-naming enforcement (`.vue` → PascalCase, `.ts`/`.json` → kebab-case), and i18n checks (`no-raw-text`, `no-missing-keys`). Husky runs `lint-staged` on pre-commit.

---

## Tech Stack

| Layer      | Library / Tool                                          |
| ---------- | ------------------------------------------------------- |
| Framework  | [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`) |
| Language   | [TypeScript](https://www.typescriptlang.org/)           |
| Build tool | [Vite](https://vite.dev/)                               |
| Styling    | [Tailwind CSS v4](https://tailwindcss.com/)             |
| State      | [Pinia](https://pinia.vuejs.org/) (thin state only)     |
| Routing    | [Vue Router](https://router.vuejs.org/)                 |
| Utilities  | [VueUse](https://vueuse.org/) · [vite-svg-loader](https://github.com/jpkleemans/vite-svg-loader) |
| i18n       | [vue-i18n v11](https://vue-i18n.intlify.dev/)           |
| Icons      | Real `.svg` files under `src/assets/icons/`, imported via `vite-svg-loader` (`?component`) |
| Unit tests | [Vitest](https://vitest.dev/) + [happy-dom](https://github.com/capricorn86/happy-dom) |
| E2E tests  | [Playwright](https://playwright.dev/)                   |
| Lint/hooks | ESLint · [Husky](https://typicode.github.io/husky/) · [lint-staged](https://github.com/lint-staged/lint-staged) |

---

## Architecture

The whole app is one desktop. Content is static and edited in `src/locales/en.json`; **all logic lives in composables** and is unit-tested. See [`CLAUDE.md`](CLAUDE.md) for the full rules.

```
src/
  components/
    ui/          → XP presentational primitives (XpWindow, XpTitleBar, DesktopIcon, BootScreen,
                   BalloonTip, ShutdownScreen, StartButton, TaskbarButton, TaskbarClock, XpIcon…).
                   Props in, events out. No logic.
    (root)       → Smart components (Desktop, DesktopWindow, DesktopIcons, Taskbar, StartMenu,
                   ContextMenu, StickyNotes, WindowContent) that wire ui/ to composables.
  composables/   → All logic, each with a unit test:
                   use-window-manager (open/close/min/max/mobile),
                   use-window-router (URL ↔ window deep-link sync),
                   use-power (boot → balloon → shutdown lifecycle),
                   use-notes (local sticky notes: spawn/drag/edit/delete),
                   use-icon-positions (drag + persisted grid, Arrange Icons),
                   use-pointer-drag (generic drag for windows/notes/icons),
                   use-desktop (icon selection + item activation),
                   use-settings (wallpaper, cursor theme), use-context-menu,
                   use-assistant (desktop assistant: load/enable/disable/switch + reactions),
                   use-escape-key + use-focus-trap (a11y), use-dynamic-text (runtime i18n keys),
                   use-start-menu, use-start-menu-items, use-window-content, use-clock.
  stores/        → Thin Pinia state containers (windows, shell, notes, settings, assistant,
                   desktop, icon-positions, context-menu).
  config/        → Structural data (desktop-items — the 12 icons + default grid; ext-badges;
                   wallpapers; cursors; assistants — the 10 agents + default; constants).
  utils/         → Pure helpers (clamp-window, clamp-menu, icon-grid, focusable, format-clock,
                   format-note-date, file-ext, generate-id, assistant-reactions), fully tested.
  lib/           → External boundaries / vendored code, used only via composables (never
                   imported directly by components/views). Excluded from lint + coverage.
                   clippy-agent.ts → our typed seam over the vendored runtime (loadAssistant →
                   AssistantHandle). Dynamically imported so clippy stays out of the initial bundle.
                   lib/clippy/ → vendored clippyjs (MIT, pi0/clippyjs): the animated desktop
                   assistant runtime (agent/animator/balloon/queue) + 10 agents, each with a
                   real map.png sprite + mp3 sounds. Kept as-is (`@ts-nocheck` on the runtime);
                   Vite code-splits every agent so only the chosen one's sprite loads on demand.
  views/         → Route-level containers. DesktopView is the single route.
  router/        → Route definitions (optional :windowId deep-links a window open).
  locales/       → en.json — all user-visible text and CV content, tree-organized for easy editing.
  i18n.d.ts      → Types en.json as the vue-i18n message schema (typos in static keys fail the build).
  styles/        → main.css — Tailwind entry + @theme XP "Luna" colour tokens + named z-index scale.
  assets/
    icons/       → Real .svg files (close, windows-flag, power, chevron-right, and the 8
                   desktop-icon glyphs), imported as components via `?component`
                   (vite-svg-loader). No inline SVG markup lives inside other components.
    *.webp        → Wallpaper photos, bundled locally (no remote image URLs).
  types/         → Shared TypeScript types.
  i18n.ts        → vue-i18n setup.
  main.ts        → App bootstrap.

tests/
  unit/          → Vitest unit tests (logic coverage).
  e2e/           → Playwright end-to-end tests: boot, window lifecycle (incl. Escape-to-close),
                   start menu/shutdown, context menu (cursor/wallpaper), deep links, sticky notes,
                   assistant (default-on first visit + turn off). The shared bootDesktop helper
                   disables the assistant so a floating agent can't shadow click targets.

docs/
  design-spec.md → The 1:1 visual spec (source of truth).
  reference/     → Literal extracted originals from example.html.
```

### Desktop settings

Right-click the desktop for the context menu: **New Note**, **Arrange Icons** (resets dragged icons to the default grid), **Cursor** (Default / Crosshair / Busy / Help — applied via native Tailwind `cursor-*` utilities), **Wallpaper** (Bliss / Green Hills / Sunset Field / Night Sky / Classic Blue), **Assistant** (None + 10 agents), and **Properties**. Choices persist in `localStorage` (`xp-wallpaper`, `xp-cursor`, `xp-icon-pos`, `xp-assistant`, `xp-assistant-name`).

Desktop icons are draggable; a dragged position overrides the default grid until "Arrange Icons" clears it.

### Desktop assistant

A Clippy-style companion (vendored from clippyjs — see `src/lib/`). It's **on by default** for first-time visitors: the agent loads during the boot screen (so the ~1 MB sprite download goes unnoticed) and greets once the desktop appears. It **reacts** to what you do — opens a window, drops a sticky note — by playing an animation and saying a line. Right-click → **Assistant** to switch between the 10 agents or turn it off; the choice persists (`xp-assistant`, `xp-assistant-name`). Only the selected agent's sprite is fetched (Vite code-splits each one). All logic lives in `use-assistant` (reactions in `assistant-reactions`); DOM/vendored contact is isolated in the `lib/clippy-agent` boundary.

> **Note:** agents ship uncompressed sprites (`src/lib/clippy/agents/*/map.png`, ~0.7–1.9 MB each) and mp3 sounds — kept as-is from upstream, worth compressing before a production deploy.

Wallpapers are bundled local photos in `src/assets/` (`bliss.webp`, `green-hills.webp`, `sunset-field.webp`, `night-sky.webp`) — no remote URLs. **Bliss** (the real default Windows XP wallpaper) is the app's default.

> **Note:** `src/assets/green-hills.webp` is ~13.9 MB — fine since it's not the default and only loads if a visitor picks it, but worth compressing (e.g. to a few hundred KB) before a production deploy.

### Deep links

Every window has a shareable URL: `/vesper`, `/about`, `/skills`, … `useWindowRouter` keeps the URL and the window manager in sync both ways (back/forward work); unknown ids redirect to `/`.

### Sticky notes

`Leave_a_Note.txt` spawns a yellow sticky note: drag it by its header, edit the text, delete it. Notes are a local scratchpad — persisted to `localStorage['xp-notes']`, no backend.

### Editing content

CV content is data, edited without touching components. In `src/locales/en.json`:

- Add or edit a role under `experience.<id>` (`title`, `meta`, `role`, `period`, `stack`, `bullets[]`).
- Skills live under `windows.skills`; interests under `windows.about`; archived roles under `archived`.

---

## Design System

A faithful Windows XP "Luna" theme. All colours are named tokens in `src/styles/main.css` (`@theme`) — e.g. `luna-blue`, `start-green`, `title-from/via/to`, `window`, `highlight`. Never use arbitrary colour values; extend the palette instead (see `CLAUDE.md` rule 7).

- **Fonts:** `Tahoma, 'Trebuchet MS', sans-serif` (UI); `'Trebuchet MS', Tahoma` (display).
- **Window model:** one window open at a time, matching the reference.
- **Stacking order:** a named z-index scale in `main.css` (`z-notes` → `z-window` → `z-taskbar` → `z-start-menu` → `z-balloon` → `z-context-menu` → `z-shutdown` → `z-boot`) — semantic classes instead of magic numbers. The window sits above notes deliberately (an open "page" should never hide under a note), the one place this diverges from the reference bundle.

### Accessibility

- The open window is a `role="dialog"` / `aria-modal` labelled by its title; focus moves into it on open and is trapped there (`use-focus-trap`).
- **Escape** closes the topmost overlay — context menu → start menu → window (`use-escape-key`).
- Desktop icons are real buttons; **Enter** opens the selected one.
- Every enabled button shows a pointer cursor.

---

## Deployment

Static SPA — deploy the `dist/` output anywhere. `vercel.json` rewrites every route to `index.html` so deep links (`/vesper`, `/about`) survive a hard refresh; on Netlify use a `_redirects` equivalent.

> **TODO:** add `public/og-image.png` (1200×630) — `index.html` references it for social previews. A screenshot of the desktop works well.

---

## Quality gates

Enforced automatically, so the rules in `CLAUDE.md` can't quietly rot:

- **pre-commit** (Husky + lint-staged): ESLint auto-fix on staged files.
- **pre-push** (Husky): `npm run verify` — blocks a push that fails lint, type-check, or 100% logic coverage.
- **Stop hook** (`.claude/settings.json`): runs `npm run verify` when Claude Code finishes a turn in this project, so violations surface immediately. (Soften it to `npm run lint` if full verify is too slow mid-flow.)
- **`reviewer` subagent** (`.claude/agents/reviewer.md`): reviews the working diff against the architecture + design contract on demand.

## CI/CD

GitHub Actions runs on every push/PR to `main`: **Lint**, **Type Check** (`vue-tsc -b`), **Unit Tests + Coverage** (100% gate), and **E2E Tests** (Playwright, report uploaded on failure).

---

## License

MIT
