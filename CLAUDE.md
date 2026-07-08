# CLAUDE.md — Project rules for Claude Code

## README

**Always keep `README.md` up to date.**

Whenever you add, remove, or change a package, script, environment requirement, directory, or architectural convention, update `README.md` to reflect the change in the same response. Do not leave the README stale after making changes to the project.

## Design source of truth

This is a 1:1 rebuild of a Windows XP desktop. The authoritative visual spec is [`docs/design-spec.md`](docs/design-spec.md), backed by the literal originals in [`docs/reference/`](docs/reference/). Match pixel values, gradients, and behaviour to those — do not improvise the look.

## Architecture rules

1. **`components/ui/` must be presentational only.** No imports from `stores/`, `api/`, or `composables/`. Props in, events out.

2. **`views/` are route-level containers.** Each view maps 1:1 to a route. They compose components and connect them to stores/composables.

3. **Smart components in `components/` (root) can use stores and composables.** They wire up `ui/` components with application logic.

4. **No direct `api/` imports in components or views.** Always go through a composable or store. Components and views must never call API functions directly.

5. **No barrel exports.** Import directly from the file: `@/components/ui/XpButton.vue`, not from an `index.ts` re-export.

6. **All user-visible text must come from `src/locales/en.json`.** Never hardcode text strings in templates or scripts. Always add the key to `en.json` and reference it with `t('key')` via `useI18n()`.

7. **Colours come from the `@theme` palette — never arbitrary values.** All Windows XP "Luna" colours are defined as named tokens in `src/styles/main.css` under `@theme` and used as first-class Tailwind classes (`bg-luna-blue`, `text-start-green`, …). Never use arbitrary colour values (`text-[#fff]`, `bg-[rgb(...)]`) or inline `style` colour properties. If a colour is missing, add a named token to `@theme` first, then use it. (Multi-stop XP gradients that cannot be a single token live in a small `@layer` utility in `main.css`, never inline.)

8. **Prefer bare Tailwind values over bracket syntax.** Tailwind v4 resolves plain numbers on spacing-scale utilities (`w-52.5`, `mt-13`, `z-2000`, …) via `calc(var(--spacing) * n)` — use that instead of `w-[210px]`-style arbitrary values wherever a bare number works. Reach for `[...]` only when the utility genuinely needs a non-numeric value (e.g. a `url(...)`, a CSS keyword combo Tailwind has no scale for).

9. **SVG icons are real `.svg` files in `src/assets/icons/`, one per file.** Import them as Vue components via the `?component` query (`import CloseIcon from '@/assets/icons/close.svg?component'`, powered by `vite-svg-loader`) — this keeps `currentColor` and class pass-through working. Never inline `<svg>` markup inside a `ui/` or smart component. Reuse an existing icon before adding a near-duplicate.

10. **Stacking uses the named z-index scale**, not magic numbers. Use the semantic classes from `main.css` (`z-window`, `z-taskbar`, `z-context-menu`, …); if a new layer is needed, add it to the scale there. Shared timing/layout values live in `src/config/constants.ts` — reference them, don't re-hardcode.

11. **Keep it accessible.** Overlays that behave like dialogs get `role="dialog"` / `aria-modal` + a focus trap; interactive things are real `<button>`/`<a>` (keyboard-operable), Escape closes the topmost overlay, and icon-only buttons carry an `aria-label`.

## i18n typing

Static message keys are typed from `en.json` (`src/i18n.d.ts`) — `t('menubar.file')` autocompletes and a typo fails the build. Keys built at runtime (window content, icon labels) go through `useDynamicText()`; their existence is guarded by `tests/unit/i18n.test.ts`, never by scattered `as` casts.

## Responsive & mobile

Every screen and component is **responsive and mobile-first**. Design at a phone width and scale up. On small viewports (`<= 640px`) windows open maximized and dragging is disabled; the desktop, taskbar, icons, and window content all adapt with fluid sizing. Never ship a component that only works on desktop.

## Logic & testing contract (non-negotiable)

- **All logic lives in composables (`composables/use-*.ts`).** Window management, boot sequence, clock, drag, persistence — none of it lives in components.
- **`ui/` components only receive props and emit events.** Zero logic, zero state beyond local view concerns.
- **Smart `components/` consume composables** and pass data down to `ui/` components.
- **Stores (`stores/`) are thin state containers.** Behaviour that acts on that state belongs in a composable.
- **All logic is covered by unit tests** in `tests/unit/`. A composable ships with its test.
