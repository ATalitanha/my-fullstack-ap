# Design System

Palette
- Primary: blue hues (`--primary`) with `--primary-foreground` for contrast.
- Secondary: neutral slate (`--secondary`) for subdued surfaces.
- Accent: indigo/purple (`--accent`) for emphasis.
- Destructive: red (`--destructive`) for dangerous actions.
- Muted: gray scales for backgrounds and borders.

Typography
- Fluid sizes via `--text-fluid-*` tokens for responsive type.
- Sans: `--font-geist-sans`; Mono: `--font-geist-mono`.
- Hierarchy: use font weights and spacing; avoid pure size jumps.

Spacing & Layout
- Radius tokens `--radius-*`; default `--radius`.
- Container: `--container` and Tailwind `max-w-7xl`.
- Grid utilities for responsive columns; maintain 8px base rhythm.

States & Interactions
- Focus ring `--ring` applied via `.focus-ring` and `:focus-visible`.
- Hover/press use subtle scale and color transitions; respect reduced motion.
- Disabled: lower opacity and pointer events disabled.

Themes
- Light/dark driven by `html.dark` class; tokens switch in media query.
- Ensure sufficient contrast (WCAG 2.1 AA) for text and controls.

