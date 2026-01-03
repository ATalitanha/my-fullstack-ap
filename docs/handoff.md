# Design-to-Development Handoff

- Tokens: source of truth in `src/app/globals.css`.
- Components: located under `src/shared/ui/*` and `src/components/layout/*`.
- States: specify hover, focus, active, disabled in component docs.
- Accessibility: keyboard navigation, skip-link, focus ring behavior.
- Animations: GSAP configs (durations, easings) defined in `docs/animations.md`.
- Assets: use Next image optimization; avoid un-optimized large backgrounds.
- Performance budgets: hero < 120ms TTI impact; per-interaction ~200ms.
- Theming: persisted in localStorage; default respects system preference.

