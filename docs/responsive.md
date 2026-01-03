# Responsive & Breakpoints

- Typography: fluid via CSS `clamp` tokens `--text-fluid-*`.
- Layout: use `max-w-7xl` container and grid utilities; avoid fixed widths.
- Breakpoints: `sm (640px)`, `md (768px)`, `lg (1024px)`, `xl (1280px)`, `2xl (1536px)`.
- Touch targets: minimum `44×44px`.
- Density: reduce shadow and blur on low-end devices.
- RTL: tested across breakpoints; ensure logical ordering.

Performance
- Images: use Next `<Image>` with responsive sizes.
- Code-splitting: route-level by default, defer heavy widgets.
- Revalidation: configure ISR for API-driven sections.

