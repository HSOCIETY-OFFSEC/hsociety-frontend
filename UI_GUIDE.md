# HSOCIETY UI Guide

This guide codifies the design language already present in the codebase and fixes inconsistencies. It should be used for all new UI work and when refactoring existing UI.

**Design Goals**
1. Cyber‑security aesthetic with restrained neon accents.
2. High contrast and legibility across dark, black, and light themes.
3. Consistent typography, spacing, radius, and elevation tokens.

**Theme Tokens**
Source of truth: `hsociety-frontend/src/styles/shared/common.css`

Use CSS variables for all colors. Do not hard‑code brand greens.  
Preferred tokens:
- `--bg-primary`, `--bg-secondary`, `--bg-tertiary`, `--card-bg`
- `--text-primary`, `--text-secondary`, `--text-tertiary`
- `--border-color`
- `--primary-color`, `--primary-color-hover`
- `--accent-ink`, `--accent-glow`
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`
- `--radius-xs`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`

**Typography**
Loaded fonts: `Sora` (UI) and `JetBrains Mono` (monospace).  
Rules:
1. UI text defaults to `Sora`.
2. Technical labels, data, and “terminal” motifs use `JetBrains Mono`.
3. Avoid additional fonts unless they are explicitly added in `index.html`.

**Color Usage**
1. Primary/brand accent: `var(--primary-color)`.
2. Status colors should be derived with `color-mix` or use dedicated tokens if added.
3. Never use literal `#00ff99` or `#10b981` in components unless a non-theme override is required.

**Elevation**
Use the shadow tokens only. Avoid one‑off shadow values.
- Small UI: `--shadow-sm`
- Standard cards: `--shadow-md`
- Highlighted cards/modals: `--shadow-lg` or `--shadow-xl`

**Radius**
Use radius tokens:
- `--radius-xs` for small chips or pill details.
- `--radius-sm` for buttons/inputs.
- `--radius-md` for cards.
- `--radius-lg` for sections and large panels.
- `--radius-xl` for hero containers.

**Motion**
Use the existing transition standards:
- Subtle `0.15s – 0.3s` for micro‑interactions.
- Keep reveal animations consistent with `reveal-on-scroll`.
Respect `prefers-reduced-motion`.

**Do / Don’t**
Do:
- Use design tokens.
- Keep spacing and radius consistent.
- Use `JetBrains Mono` for code/data.

Don’t:
- Introduce new fonts without adding them to `index.html`.
- Hard‑code green accent values.
- Mix shadow styles across sections.
